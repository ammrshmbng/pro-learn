import React, { CSSProperties } from "react";
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr, Button } from "@react-email/components";

interface ProPlanActivatedEmailProps {
	name: string;
	planType: string;
	currentPeriodStart: number;
	currentPeriodEnd: number;
	url: string;
}

const ProPlanActivatedEmail = ({
	name,
	planType,
	currentPeriodStart,
	currentPeriodEnd,
	url,
}: ProPlanActivatedEmailProps) => {
	const startDate = new Date(currentPeriodStart * 1000).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const endDate = new Date(currentPeriodEnd * 1000).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<Html>
			<Head />
			<Preview>Welcome to MasterClass Pro - Your premium learning journey begins!</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={content}>
						<Heading style={heading}>Welcome to Pro! 🎉</Heading>
						<Text style={greeting}>Hi {name},</Text>

						<Section style={proSection}>
							<Text style={thankYouText}>
								Thank you for upgrading to MasterClass Pro! Your {planType}ly subscription is now
								active.
							</Text>

							<Section style={subscriptionDetails}>
								<Text style={detailsHeading}>Your Subscription Details</Text>
								<Text style={detailsText}>Plan: Pro {planType}ly</Text>
								<Text style={detailsText}>Start Date: {startDate}</Text>
								<Text style={detailsText}>Next Billing Date: {endDate}</Text>
							</Section>
						</Section>

						<Section style={benefitsSection}>
							<Text style={benefitsHeading}>What&apos;s Included in Pro:</Text>
							<ul style={benefitsList}>
								<li style={benefitsItem}>✨ Unlimited access to all courses</li>
								<li style={benefitsItem}>💻 Downloadable project resources</li>
								<li style={benefitsItem}>🎯 Priority support</li>
								<li style={benefitsItem}>🏆 Pro member badge</li>
							</ul>
						</Section>

						<Section style={ctaSection}>
							<Text style={text}>Ready to explore all your Pro features?</Text>
							<Button href={url} style={button}>
								Start Exploring Pro
							</Button>
						</Section>

						<Hr style={hr} />

						<Text style={supportText}>Need help? Our support team is always here to assist you.</Text>
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

export default ProPlanActivatedEmail;

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
	borderRadius: "12px",
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const heading: CSSProperties = {
	fontSize: "32px",
	lineHeight: 1.3,
	fontWeight: "700",
	color: "#1a1a1a",
	textAlign: "center",
	margin: "0 0 24px",
};

const greeting: CSSProperties = {
	fontSize: "18px",
	color: "#1a1a1a",
	margin: "0 0 16px",
	fontWeight: "500",
};

const proSection: CSSProperties = {
	margin: "24px 0",
	padding: "24px",
	backgroundColor: "#f8fafc",
	borderRadius: "8px",
};

const thankYouText: CSSProperties = {
	fontSize: "16px",
	color: "#1a1a1a",
	margin: "0 0 20px",
	textAlign: "center",
};

const subscriptionDetails: CSSProperties = {
	backgroundColor: "#ffffff",
	padding: "20px",
	borderRadius: "6px",
	margin: "20px 0",
};

const detailsHeading: CSSProperties = {
	fontSize: "16px",
	fontWeight: "600",
	color: "#1a1a1a",
	margin: "0 0 12px",
};

const detailsText: CSSProperties = {
	fontSize: "14px",
	color: "#4b5563",
	margin: "8px 0",
};

const benefitsSection: CSSProperties = {
	margin: "24px 0",
};

const benefitsHeading: CSSProperties = {
	fontSize: "16px",
	fontWeight: "600",
	color: "#1a1a1a",
	margin: "0 0 16px",
};

const benefitsList: CSSProperties = {
	listStyleType: "none",
	padding: 0,
	margin: "0 0 24px",
};

const benefitsItem: CSSProperties = {
	fontSize: "15px",
	color: "#4b5563",
	margin: "12px 0",
};

const ctaSection: CSSProperties = {
	textAlign: "center",
	margin: "32px 0",
};

const text: CSSProperties = {
	margin: "0 0 16px",
	color: "#484848",
	fontSize: "16px",
	lineHeight: "24px",
};

const button: CSSProperties = {
	backgroundColor: "#2563eb",
	borderRadius: "6px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center",
	display: "inline-block",
	padding: "12px 24px",
	border: "none",
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
