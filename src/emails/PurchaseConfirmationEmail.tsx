import React, { CSSProperties } from "react";
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr, Button, Img } from "@react-email/components";

interface PurchaseConfirmationEmailProps {
	customerName: string;
	courseTitle: string;
	courseImage: string;
	courseUrl: string;
	purchaseAmount: number;
}

const PurchaseConfirmationEmail = ({
	customerName = "there",
	courseTitle = "Course Title",
	courseImage = "https://via.placeholder.com/600x300",
	courseUrl = "#",
	purchaseAmount = 0,
}: PurchaseConfirmationEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Thank you for your purchase: {courseTitle}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={content}>
						<Heading style={heading}>Purchase Confirmed!</Heading>
						<Text style={text}>Hi {customerName},</Text>
						<Text style={text}>Thank you for your purchase. You now have full access to:</Text>

						<Section style={courseSection}>
							<Img src={courseImage} alt={courseTitle} width='500' height='250' style={imageStyle} />
							<Text style={courseTitleStyle}>{courseTitle}</Text>
							<Text style={priceText}>Amount paid: ${purchaseAmount.toFixed(2)}</Text>
						</Section>

						<Text style={text}>You can start learning right away by clicking the button below:</Text>

						<Button href={courseUrl} style={button}>
							Start Learning
						</Button>

						<Hr style={hr} />

						<Text style={supportText}>
							If you have any questions or need support, don&apos;t hesitate to reach out to our team.
						</Text>
					</Section>

					<Section style={footer}>
						<Text style={footerText}>
							© {new Date().getFullYear()} MasterClass, Inc. All Rights Reserved.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default PurchaseConfirmationEmail;

const main: CSSProperties = {
	backgroundColor: "#f6f9fc",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container: CSSProperties = {
	margin: "0 auto",
	padding: "20px 0 48px",
	width: "580px",
};

const content: CSSProperties = {
	backgroundColor: "#ffffff",
	padding: "40px",
	borderRadius: "5px",
	boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const heading: CSSProperties = {
	fontSize: "28px",
	lineHeight: 1.3,
	fontWeight: "700",
	color: "#1a1a1a",
	textAlign: "center",
	margin: "0 0 24px",
};

const text: CSSProperties = {
	margin: "0 0 16px",
	color: "#484848",
	fontSize: "16px",
	lineHeight: "24px",
};

const courseSection: CSSProperties = {
	margin: "24px 0",
	padding: "20px",
	backgroundColor: "#f8fafc",
	borderRadius: "8px",
	textAlign: "center",
};

const imageStyle: CSSProperties = {
	borderRadius: "4px",
	marginBottom: "16px",
};

const courseTitleStyle: CSSProperties = {
	fontSize: "20px",
	fontWeight: "600",
	color: "#1a1a1a",
	margin: "0 0 8px",
};

const priceText: CSSProperties = {
	fontSize: "18px",
	color: "#2563eb",
	fontWeight: "600",
	margin: "8px 0",
};

const button: CSSProperties = {
	backgroundColor: "#2563eb",
	borderRadius: "5px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center",
	display: "block",
	width: "100%",
	padding: "12px",
	marginTop: "24px",
};

const supportText: CSSProperties = {
	fontSize: "14px",
	color: "#64748b",
	textAlign: "center",
	margin: "16px 0 0",
};

const hr: CSSProperties = {
	borderColor: "#e6e6e6",
	margin: "24px 0",
};

const footer: CSSProperties = {
	marginTop: "32px",
};

const footerText: CSSProperties = {
	color: "#9ca299",
	fontSize: "14px",
	textAlign: "center",
};
