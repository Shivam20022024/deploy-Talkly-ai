from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Talkly AI - Potential Industry Use Cases', 0, 1, 'C')
        self.ln(10)

    def chapter_title(self, num, title):
        self.set_font('Arial', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 10, f'{num}. {title}', 0, 1, 'L', 1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 11)
        self.multi_cell(0, 8, body)
        self.ln(6)

pdf = PDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)

# Intro
pdf.set_font('Arial', '', 11)
intro = "Based on the core features of Talkly AI (Lead Intelligence, Intent Scoring, Voice AI, Live Monitoring, and Auto-Scheduling), it is a highly versatile tool that can be used across many different industries. Here are some major sectors where Talkly AI would be extremely valuable:"
pdf.multi_cell(0, 8, intro)
pdf.ln(10)

# Sectors
sectors = [
    ("Real Estate (Current Focus)", "Use Cases: Qualifying property buyers, capturing budget and location preferences (e.g., '2BHK in Sector 142'), scheduling site visits, and answering basic questions about amenities."),
    ("Banking, Financial Services & Insurance (BFSI)", "Use Cases: Qualifying leads for personal/home loans, explaining insurance policy benefits, handling premium renewal reminders, and setting up meetings with financial advisors."),
    ("Healthcare & Clinics", "Use Cases: Automating patient appointment bookings, sending automated voice reminders for check-ups, handling basic FAQs about clinic timings or available doctors, and initial patient intake/triage."),
    ("Automotive Dealerships", "Use Cases: Calling online leads who showed interest in a car, scheduling test drives, booking vehicle service appointments, and following up on post-service feedback."),
    ("EdTech & Education", "Use Cases: Reaching out to students who inquired about a course, explaining syllabus details, reminding parents about fee deadlines, and scheduling counseling sessions."),
    ("E-Commerce & Retail", "Use Cases: Abandoned cart recovery (calling high-value customers who left items in their cart), providing automated order tracking updates, and handling return/refund requests via voice."),
    ("Travel & Hospitality", "Use Cases: Booking hotels or flights, answering FAQs about travel packages, handling itinerary changes, and confirming restaurant reservations.")
]

for i, (title, body) in enumerate(sectors, 1):
    pdf.chapter_title(i, title)
    pdf.chapter_body(body)

# Conclusion
pdf.set_font('Arial', 'B', 11)
pdf.multi_cell(0, 8, "The core advantage of Talkly: Any sector that relies on a sales team or a call center can use it to completely replace their Level-1 (initial) callers, saving them immense amounts of time and money!")

pdf.output('TalklyAI_UseCases.pdf')
