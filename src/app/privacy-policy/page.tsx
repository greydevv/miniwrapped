import Image from "next/image";

const sections = [
  {
    header: "Introduction",
    body: [
      "This policy explains how we collect, use, and disclose information gathered from users of Miniwrapped. By accessing or using Miniwrapped, you acknowledge you have read, understood, and agreed to the terms of this privacy policy. If you do not agree with any part of this policy, please do not use our website."
    ]
  },
  {
    header: "Information Collected",
    body: []
  },
  {
    header: "Use of Information",
    body: []
  },
  {
    header: "Third-Party Services",
    body: []
  },
  {
    header: "Cookies",
    body: []
  },
  {
    header: "Data Security",
    body: []
  },
  {
    header: "User Rights",
    body: []
  },
  {
    header: "Updates to Privacy Policy",
    body: [
      "We reserve the right to update, without notice, any part of this document at any time. The changes made to this document and the dates associated with those changes are posted in the section titled \"Change Log\" at the end of this document."
    ]
  },
  {
    header: "Contact Information",
    body: []
  },
  {
    header: "Legal Compliance",
    body: []
  },
  {
    header: "Change Log",
    body: ["Last updated on March 18, 2024."]
  }
];

export default function PrivacyPolicy() {
  return (
    <main className="bg-light text-dark min-h-screen w-screen">
      <div className="max-w-6xl px-24 py-12 mx-auto">
        <div className="mb-4">
          <Image
            src="/images/logo.png"
            width="134"
            height="22"
            alt=""
          />
          <h1 className="mt-2">Privacy Policy</h1>
        </div>
        { sections.map((section, i) => {
          return (
            <div key={ i } className="mt-4">
              <h3 className="font-bold">{ section.header }</h3>
              { section.body.map((bodyText, j) => {
                return (
                  <p key={ j } className="max-w-xl">
                    { bodyText }
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    </main>
  )
}
