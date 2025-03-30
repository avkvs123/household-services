import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


SMTP_Server = "localhost"
SMTP_PORT = 1025
SENDER_MAIL = "admin@email.com"
SENDER_PASSWORD = 'admin'

def send_email(to, subject, content, content_type):
    # content_type -> html, text, etc
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = SENDER_MAIL

    msg.attach(MIMEText(content, content_type))

    with smtplib.SMTP(host=SMTP_Server, port=SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()



# send_email('avkvs123@gmail.com', "Test MAil", "<h1>Test Mail</h1>")