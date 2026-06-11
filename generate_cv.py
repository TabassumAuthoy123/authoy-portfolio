import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def create_cv(output_path):
    # Setup document
    # 0.5 inch margins (36 points)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    # Styles
    styles = getSampleStyleSheet()
    
    # Custom color palette (navy/slate themes)
    primary_color = colors.HexColor("#0f172a") # Dark Slate
    secondary_color = colors.HexColor("#1e3a8a") # Dark Navy
    text_color = colors.HexColor("#334155") # Muted dark gray for body
    light_line_color = colors.HexColor("#cbd5e1") # Light gray for dividers
    
    # Define custom styles
    title_style = ParagraphStyle(
        'CVTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=primary_color,
        alignment=TA_CENTER,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'CVSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=secondary_color,
        alignment=TA_CENTER,
        spaceAfter=6
    )
    
    contact_style = ParagraphStyle(
        'CVContact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=text_color,
        alignment=TA_CENTER,
        spaceAfter=10
    )
    
    section_heading = ParagraphStyle(
        'CVSectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=secondary_color,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'CVBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=text_color,
        spaceAfter=6
    )
    
    bold_body_style = ParagraphStyle(
        'CVBoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    bullet_style = ParagraphStyle(
        'CVBullet',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=3
    )

    story = []

    # 1. Header Section
    story.append(Paragraph("TABASSUM MUSTAFA AUTHOY", title_style))
    story.append(Paragraph("Software Engineer &bull; Researcher &bull; Business Development Manager", subtitle_style))
    
    contact_info = (
        "Dhaka, Bangladesh &nbsp;|&nbsp; "
        "tabassumauthoy123@gmail.com &nbsp;|&nbsp; "
        "linkedin.com/in/tabassum-authoy &nbsp;|&nbsp; "
        "github.com/TabassumAuthoy123"
    )
    story.append(Paragraph(contact_info, contact_style))

    def add_divider():
        # A simple thin line table as divider
        divider_table = Table([[""]], colWidths=[540], rowHeights=[1])
        divider_table.setStyle(TableStyle([
            ('LINEABOVE', (0,0), (-1,-1), 0.75, light_line_color),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(divider_table)
        story.append(Spacer(1, 4))

    # 2. Professional Summary
    story.append(Paragraph("PROFESSIONAL SUMMARY", section_heading))
    add_divider()
    summary_text = (
        "A multidisciplinary practitioner working at the intersection of technology, research, and art. "
        "Experienced software engineer and Business Development Manager based in Dhaka, Bangladesh, with hands-on experience "
        "spanning front-end development, travel OTA platform engineering, UI/UX collaboration, digital platform coordination, "
        "and IT-driven business operations. Passionate about technical solution design, building functional web interfaces, "
        "coordinating between clients and engineering teams, and researching reliable and trustworthy artificial intelligence "
        "systems (reducing hallucinations and uncertainty in LLMs)."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 4))

    # 3. Work Experience
    story.append(Paragraph("PROFESSIONAL EXPERIENCE", section_heading))
    add_divider()
    
    # Job 1
    story.append(Paragraph("<b>Business Development Manager</b> &nbsp;|&nbsp; SoftifyBD Limited, Dhaka", bold_body_style))
    # Date & Location as right-aligned table or inline
    story.append(Paragraph("<i>March 2026 &ndash; Present</i>", ParagraphStyle('JobDate', parent=body_style, fontName='Helvetica-Oblique', spaceAfter=2)))
    story.append(Paragraph("&bull; Promoted from Senior BD Executive within 2 months of joining and confirmed as permanent employee.", bullet_style))
    story.append(Paragraph("&bull; Leads B2B SaaS sales, full-cycle project management, and client consultancy across the company's product portfolio (Faith Trip, ISP Digital, TrackMe, RoadGuard).", bullet_style))
    story.append(Paragraph("&bull; Manages client requirement gathering, technical solution design, enterprise client engagement, and onboarding.", bullet_style))
    story.append(Paragraph("&bull; Undertakes concurrent full-stack development (frontend, backend) of in-house B2B SaaS platforms and drives AI-augmented workflows.", bullet_style))
    story.append(Spacer(1, 4))
    
    # Job 2
    story.append(Paragraph("<b>Senior Executive &ndash; Business Development & IT</b> &nbsp;|&nbsp; TechSolutions Plex Limited, Dhaka", bold_body_style))
    story.append(Paragraph("<i>August 2025 &ndash; January 2026</i>", ParagraphStyle('JobDate', parent=body_style, fontName='Helvetica-Oblique', spaceAfter=2)))
    story.append(Paragraph("&bull; Supported IT operations across the company's Fanam Trip OTA platform, e-commerce systems (Discount Bazar, Banglar Bike, YEDI), and core digital business platforms.", bullet_style))
    story.append(Paragraph("&bull; Coordinated between technical development teams and management to gather system requirements and implement usability improvements.", bullet_style))
    story.append(Paragraph("&bull; Monitored usability issues, prepared technical reports, system documentation, and conducted stakeholder presentations.", bullet_style))
    story.append(Paragraph("&bull; Mentored junior staff on system usage, tooling, and workflow automation processes.", bullet_style))
    story.append(Spacer(1, 4))
    
    # Job 3
    story.append(Paragraph("<b>Front-End Developer & Senior Sales & Agent Support Executive</b> &nbsp;|&nbsp; NZ World Travels, Hybrid", bold_body_style))
    story.append(Paragraph("<i>November 2022 &ndash; May 2025</i>", ParagraphStyle('JobDate', parent=body_style, fontName='Helvetica-Oblique', spaceAfter=2)))
    story.append(Paragraph("&bull; Developed and maintained responsive web pages utilizing HTML, CSS, and Figma-based UI implementation.", bullet_style))
    story.append(Paragraph("&bull; Supported the operations of the OTA platform mynztrip.com, GSA partners, and inventory and accounting integrations.", bullet_style))
    story.append(Paragraph("&bull; Coordinated specifications for third-party API integrations, and conducted regular usability and cross-device bug testing.", bullet_style))
    story.append(Spacer(1, 4))

    # Job 4
    story.append(Paragraph("<b>IT Industrial Internship (Full-Time)</b> &nbsp;|&nbsp; QRAC Homes, Malaysia", bold_body_style))
    story.append(Paragraph("<i>July 2022 &ndash; October 2022</i>", ParagraphStyle('JobDate', parent=body_style, fontName='Helvetica-Oblique', spaceAfter=2)))
    story.append(Paragraph("&bull; Supported IT system rollout, database maintenance, first-level troubleshooting, and system testing.", bullet_style))
    story.append(Spacer(1, 4))

    # Job 5/6 short mentions
    story.append(Paragraph("<b>Assistant Project Manager &ndash; Tech Programs</b> &nbsp;|&nbsp; BeyondGrades & Pathfinder (Dec 2021 &ndash; May 2022)", bold_body_style))
    story.append(Paragraph("<b>IT & Operations Intern</b> &nbsp;|&nbsp; Trivooz (June 2021 &ndash; November 2021)", bold_body_style))
    story.append(Spacer(1, 6))

    # 4. Education
    story.append(Paragraph("EDUCATION", section_heading))
    add_divider()
    
    story.append(Paragraph("<b>University of Dhaka, Faculty of Business Studies</b> &mdash; Executive MBA in MIS (2026 &ndash; 2028 | In Progress)", bold_body_style))
    story.append(Paragraph("<b>BRAC University, Bangladesh</b> &mdash; Master of Science in Computer Science & Engineering (2025 &ndash; 2027 | In Progress)", bold_body_style))
    story.append(Paragraph("&bull; Graduate research direction: AI safety, reduction of LLM hallucinations, and uncertainty calibration.", bullet_style))
    story.append(Paragraph("<b>SEGi University, Malaysia</b> &mdash; B.Sc. (Honours) in Information Technology &ndash; Software Engineering (Graduated 2023)", bold_body_style))
    story.append(Paragraph("&bull; Academic Performance: <b>First Class Honours</b>, CGPA <b>3.70 / 4.00</b>, Dean's List.", bullet_style))
    story.append(Paragraph("<b>Bangladesh University of Professionals (BUP)</b> &mdash; Bachelor in Economics (First Year Completed, 2019 &ndash; 2020)", bold_body_style))
    story.append(Paragraph("&bull; CGPA 3.33/4.00; Received merit-based transfer scholarship to SEGi University Malaysia for IT studies.", bullet_style))
    story.append(Spacer(1, 6))

    # 5. Research & Projects
    story.append(Paragraph("RESEARCH PROJECTS & PUBLICATIONS", section_heading))
    add_divider()
    
    story.append(Paragraph("<b>Gender, Course-Type, and Academic Performance Analysis</b> &nbsp;|&nbsp; Co-Author", bold_body_style))
    story.append(Paragraph("&bull; Empirical study examining factors driving undergraduate performance in Business Studies at DU using ANOVA, Linear Mixed Models (LMMs), Random Forest, XGBoost, CatBoost, and SHAP explainability. (Target: IEEE ICCIT/ICISET).", bullet_style))
    
    story.append(Paragraph("<b>Synaptic Replay Networks (SRNs): Dream-Phase Self-Rehearsal to Calibrate LLM Memory</b> &nbsp;|&nbsp; Lead Researcher", bold_body_style))
    story.append(Paragraph("&bull; Neuro-inspired architecture proposal integrating offline replay buffers with a metacognitive risk detection head to decrease overconfident hallucinations and prevent catastrophic forgetting in language models.", bullet_style))
    
    story.append(Paragraph("<b>Heal Here: Intelligent Mobile App for Trauma Assessment</b> &nbsp;|&nbsp; Final-Year Capstone Project", bold_body_style))
    story.append(Paragraph("&bull; Designed and developed a Kotlin-based Android application for post-pandemic mental health trauma assessment, incorporating structured assessment modules and user-centered usability features.", bullet_style))
    story.append(Spacer(1, 6))

    # 6. Technical Skills
    story.append(Paragraph("TECHNICAL & PROFESSIONAL SKILLS", section_heading))
    add_divider()
    
    skills_data = [
      [Paragraph("<b>Web & Design:</b>", body_style), Paragraph("HTML5, CSS3, Responsive Design, UI implementation from Figma, basic JavaScript, Cross-Browser Testing", body_style)],
      [Paragraph("<b>Programming & Data:</b>", body_style), Paragraph("C++, Java, Python, Jupyter, Kaggle, Machine Learning, Data Cleaning & Visualization", body_style)],
      [Paragraph("<b>Platforms & Operations:</b>", body_style), Paragraph("Travel OTA Platforms, SRS Documentation, Inventory & Accounting Integration, API Coordination", body_style)],
      [Paragraph("<b>UI/UX & Collaboration:</b>", body_style), Paragraph("Figma, Canva, Usability Testing, Interface Consistency, Cross-Functional Coordination", body_style)],
      [Paragraph("<b>Productivity:</b>", body_style), Paragraph("MS Excel/Access, Git/GitHub (Basic), Technical Reporting, Workflow Documentation", body_style)]
    ]
    skills_table = Table(skills_data, colWidths=[130, 410])
    skills_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 6))

    # 7. Awards, Leadership & Languages
    story.append(Paragraph("LEADERSHIP, AWARDS & CREATIVE PRACTICE", section_heading))
    add_divider()
    
    story.append(Paragraph("&bull; <b>Student & Cultural Ambassador</b> (SEGi ICN 2022): Coordinated performance logistics, costume design, and solo choreography.", bullet_style))
    story.append(Paragraph("&bull; <b>Volunteer</b> (Bishwa Sahitto Kendro): Supported book reading literacy programs across schools.", bullet_style))
    story.append(Paragraph("&bull; <b>Classical Performer</b>: Trained in classical dance at Chhayanaut Shongshkriti-Bhobon.", bullet_style))
    story.append(Paragraph("&bull; <b>Languages:</b> Bangla (Native), English (Fluent - Academic/Professional), Hindi (Fluent), Malay (Basic).", bullet_style))

    # Build PDF
    doc.build(story)
    print(f"PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    # Target folders
    paths = [
        "c:/Users/authoy-portfolio/client/public/Tabassum_Mustafa_Authoy_CV.pdf",
        "c:/Users/authoy-portfolio/server/uploads/Tabassum_Mustafa_Authoy_CV.pdf"
    ]
    for p in paths:
        # Create parent dirs if not existing
        os.makedirs(os.path.dirname(p), exist_ok=True)
        create_cv(p)
