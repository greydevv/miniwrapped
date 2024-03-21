import Image from "next/image";

const sections = [
  {
    header: "Introduction",
    body: [
      "This policy explains how we collect, use, and disclose information gathered from users of Miniwrapped (sometimes referred to as \"service\"). By accessing or using Miniwrapped, you acknowledge you have read, understood, and agreed to the terms of this privacy policy. If you do not agree with any part of this policy, please do not use our website.",
      "Miniwrapped is not affiliated with Spotify in any way.",
    ]
  },
  {
    header: "Information Collected",
    body: [
      "By logging in with your Spotify account, you are providing Miniwrapped with your email and type of subscription associated with your Spotify account. Additionally, your top listening statistics such as top artists and top tracks are collected.",
      "Miniwrapped neither requests information nor data from Spotify unless you are actively using the service.",
    ]
  },
  {
    header: "Use of Information",
    body: [
      "Any information and data collected is exclusively used to provide you with our service. We will never provide your data to third-party services. Additionally, we will not analyze your data to provide recommendations of advertisements to you."
    ]
  },
  // {
  //   header: "Use of Information",
  //   body: []
  // },
  // {
  //   header: "Third-Party Services",
  //   body: [
  //   ]
  // },
  {
    header: "Cookies",
    body: [
      "Cookies are small chunks of information about you such as your browser, location, and IP address. Miniwrapped currently does not use cookies.",
    ]
  },
  {
    header: "Data Security",
    body: []
  },
  {
    header: "User Rights",
    body: [
      "Users and data subjects have the right to:",
      "• confirm whether their data is being processed, how their data is processed, and the reason(s) why their data is processed.",
      "• request immediate deletion of data concerning them.",
      "• receive copies of the data concerning them."
    ]
  },
  {
    header: "Updates to Privacy Policy",
    body: [
      "We reserve the right to update, without notice, any part of this document at any time. The changes made to this document and the dates associated with those changes are posted in the section titled \"Change Log\" at the end of this document."
    ]
  },
  {
    header: "Contact Information",
    body: [
      "Greyson Murray",
      "greyson.murray@gmail.com",
    ]
  },
  // {
  //   header: "Legal Compliance",
  //   body: []
  // },
  {
    header: "Change Log",
    body: ["Last updated on March 18, 2024."]
  }
];

export default function PrivacyPolicy() {
  return (
    <main className="bg-light text-dark min-h-screen w-screen">
      <div className="max-w-6xl px-4 sm:px-24 py-12 mx-auto">
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
                  <p key={ j } className="text-sm sm:text-base max-w-xl">
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
