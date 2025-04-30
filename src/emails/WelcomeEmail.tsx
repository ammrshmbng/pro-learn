import React from "react";
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Hr, Button } from "@react-email/components";

const WelcomeEmail = ({ name, url }: { name: string; url: string }) => {
	return (
		<Html>
			<Head />
			<Preview>Welcome to MasterClass - Your learning journey begins!</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={content}>
						<Heading style={heading}>Welcome to MasterClass!</Heading>
						<Text style={text}>Hello {name},</Text>
						<Text style={text}>
							We&apos;re thrilled to have you join our community of learners! You&apos;ve taken the first
							step towards mastering modern development skills through engaging, project-based learning.
						</Text>
						<Hr style={hr} />
						<Text style={text}>With MasterClass, you can:</Text>
						<ul style={list}>
							<li>Build real-world projects like Netflix and Twitter clones</li>
							<li>Master full-stack development with the MERN stack</li>
							<li>Learn at your own pace with our flexible, online platform</li>
						</ul>
						<Hr style={hr} />
						<Text style={text}>
							Ready to start forging your path in modern development? Explore our course catalog and begin
							your learning journey today!
						</Text>
						<Button href={url} style={button}>
							Explore Courses
						</Button>
					</Section>
					<Hr style={hr} />
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

export default WelcomeEmail;

const main = {
	backgroundColor: "#f6f9fc",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	width: "580px",
};

const content = {
	backgroundColor: "#ffffff",
	padding: "40px",
	borderRadius: "5px",
};

const heading = {
	fontSize: "32px",
	lineHeight: "1.3",
	fontWeight: "700",
	color: "#1a1a1a",
	textAlign: "center" as const,
	letterSpacing: "-1px",
};

const text = {
	margin: "0 0 16px",
	color: "#484848",
	fontSize: "16px",
	lineHeight: "24px",
};

const list = {
	...text,
	paddingLeft: "30px",
};

const button = {
	backgroundColor: "#5e6ad2",
	borderRadius: "5px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	width: "100%",
	padding: "12px",
};

const hr = {
	borderColor: "#e6e6e6",
	margin: "20px 0",
};

const footer = {
	marginTop: "32px",
};

const footerText = {
	color: "#9ca299",
	fontSize: "14px",
	textAlign: "center" as const,
};
