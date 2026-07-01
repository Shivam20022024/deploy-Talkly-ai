from datetime import datetime, timedelta
import asyncio
from typing import Dict, Any, List

class IntelligenceService:
    """
    Service for calculating AI Business Intelligence metrics across calls.
    """
    
    async def get_dashboard_metrics(self, db) -> Dict[str, Any]:
        """
        Calculates top-level metrics for the BI Dashboard.
        """
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        # 1. Total Calls
        total_calls = await db.calls.count_documents({})
        
        # 2. Funnel Stats
        hot_leads = await db.calls.count_documents({"analysis.lead_temperature": "Hot"})
        warm_leads = await db.calls.count_documents({"analysis.lead_temperature": "Warm"})
        cold_leads = await db.calls.count_documents({"analysis.lead_temperature": "Cold"})
        
        # 3. Sentiment Distribution
        pipeline = [
            {"$group": {"_id": "$sentiment", "count": {"$sum": 1}}}
        ]
        sentiment_agg = await db.calls.aggregate(pipeline).to_list(length=10)
        sentiment_dist = {str(item["_id"]).lower(): item["count"] for item in sentiment_agg if item["_id"]}
        
        # 4. Top Objections (flattening the key_objections array)
        objection_pipeline = [
            {"$unwind": "$analysis.key_objections"},
            {"$group": {"_id": "$analysis.key_objections.type", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        objections_agg = await db.calls.aggregate(objection_pipeline).to_list(length=5)
        top_objections = [{"objection": item["_id"], "count": item["count"]} for item in objections_agg]
        
        # 5. Language Distribution
        lang_pipeline = [
            {"$group": {"_id": "$language", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        lang_agg = await db.calls.aggregate(lang_pipeline).to_list(length=10)
        languages = [{"language": item["_id"] or "Unknown", "count": item["count"]} for item in lang_agg]
        
        # 6. Average Lead Score
        score_pipeline = [
            {"$match": {"analysis.lead_score": {"$exists": True}}},
            {"$group": {"_id": None, "avg_score": {"$avg": "$analysis.lead_score"}}}
        ]
        score_agg = await db.calls.aggregate(score_pipeline).to_list(length=1)
        avg_score = round(score_agg[0]["avg_score"], 1) if score_agg else 0
        
        return {
            "total_calls": total_calls,
            "lead_funnel": {
                "hot": hot_leads,
                "warm": warm_leads,
                "cold": cold_leads
            },
            "sentiment": {
                "positive": sentiment_dist.get("positive", 0),
                "neutral": sentiment_dist.get("neutral", 0),
                "negative": sentiment_dist.get("negative", 0)
            },
            "top_objections": top_objections,
            "language_distribution": languages,
            "average_lead_score": avg_score
        }

    async def get_customer_timeline(self, db, customer_id: str) -> List[Dict[str, Any]]:
        """
        Fetches the complete timeline of interactions for a given customer phone number.
        """
        # Ensure correct formatting (some might have +, some might not)
        clean_id = customer_id.replace('+', '').strip()
        
        calls = await db.calls.find(
            {"customer_id": {"$regex": f"{clean_id}$"}}
        ).sort("created_at", -1).to_list(length=50)
        
        timeline = []
        for call in calls:
            # Map call document to a timeline event
            timeline.append({
                "type": "call",
                "id": call.get("call_id"),
                "date": call.get("created_at"),
                "direction": call.get("direction", "outbound"),
                "status": call.get("status"),
                "duration": "00:00", # TODO: compute from timestamps if available
                "summary": call.get("summary", ""),
                "sentiment": call.get("sentiment", "neutral"),
                "lead_score": call.get("analysis", {}).get("lead_score", 0),
                "action_items": call.get("analysis", {}).get("action_items", [])
            })
            
        return timeline
