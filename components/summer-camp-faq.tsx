export function SummerCampFAQ() {
  const faqItems = [
    {
      id: "item-1",
      question: "Do I need blockchain experience to apply?",
      answer:
        "Not necessarily! While Web3/DeFi experience is helpful, we welcome volunteers who have expertise in education, financial inclusion, and technology adoption.",
      cardClass: "web3-card-purple",
    },
    {
      id: "item-2",
      question: "Will I be working directly with farmers?",
      answer:
        "Yes! Volunteers will work side by side with smallholder farmers, cooperatives, and young trainees in rural coffee communities.",
      cardClass: "web3-card-blue",
    },
    {
      id: "item-3",
      question: "What language is the program conducted in?",
      answer: "The main language of instruction is English, but we will have translators for local languages.",
      cardClass: "web3-card-teal",
    },
    {
      id: "item-4",
      question: "What about internet and logistics?",
      answer:
        "The program locations will have stable internet access, and logistics are handled by WAGA and local partners.",
      cardClass: "web3-card-pink",
    },
    {
      id: "item-5",
      question: "Can I bring a friend or colleague?",
      answer: "Yes! We encourage group applications, so feel free to apply with a friend or fellow Web3 enthusiast.",
      cardClass: "web3-card-amber",
    },
    {
      id: "item-6",
      question: "What's included in the program?",
      answer:
        "WAGA covers accommodation in coffee-producing regions, local transport within Ethiopia, daily meals, coffee farm visits, and cultural experiences. Volunteers are responsible for their own international travel and visa arrangements.",
      cardClass: "web3-card-emerald",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {faqItems.map((item) => (
        <div key={item.id} className={`rounded-lg overflow-hidden ${item.cardClass}`}>
          <div className="px-4 py-4 border-b border-white/10">
            <h3 className="text-base font-medium">{item.question}</h3>
          </div>
          <div className="px-4 py-4 text-muted-foreground">
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
