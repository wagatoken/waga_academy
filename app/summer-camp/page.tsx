"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, MapPin, Award, Coffee, Lightbulb, Globe, Heart } from "lucide-react";
import { BlockchainPlaceholder } from "@/components/animations/blockchain-placeholder";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function SummerCampPage() {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
        <div className="absolute inset-0 z-0 web3-grid-bg"></div>
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-20 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 -right-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-sm text-purple-300">
                July - September 2024
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none web3-dual-gradient-text-glow">
                WAGA Summer Camp
              </h1>
              <p className="text-muted-foreground md:text-xl">A Web3 & Coffee Innovation Experience in Ethiopia</p>
              <p className="text-muted-foreground">
                Join our immersive volunteer program in Ethiopia's coffee-producing regions and help empower the next
                generation of smallholder farmers with Web3 technology
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="web3-button-purple">
                  <Link href="/summer-camp/register">Register Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-purple-500/30 hover:border-purple-500/60">
                  <Link href="#faq">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden web3-card">
              <BlockchainPlaceholder
                height={500}
                variant="default"
                nodeCount={18}
                alt="WAGA Summer Camp blockchain visualization"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Info Section */}
      <section className="w-full py-12 md:py-24 relative">
        <div className="absolute inset-0 z-0 web3-grid-bg"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-dual-gradient-text-glow text-center mb-8">
            Key Information
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 web3-dual-gradient-text-glow">
              <CalendarDays className="h-12 w-12 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-center">July - September 2024</h3>
              <p className="text-muted-foreground text-center">
                Flexible 2-4 week volunteer program with multiple start dates
              </p>
            </div>
            <div className="relative p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 web3-dual-gradient-text-glow">
              <MapPin className="h-12 w-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-center">Ethiopia</h3>
              <p className="text-muted-foreground text-center">
                Experience the birthplace of coffee in its coffee-producing regions
              </p>
            </div>
            <div className="relative p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 web3-dual-gradient-text-glow">
              <Users className="h-12 w-12 text-teal-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-center">200+ Farmers</h3>
              <p className="text-muted-foreground text-center">
                Train the next generation of coffee farmers and "Coffeepreneurs" in Web3 and digital skills
              </p>
            </div>
            <div className="relative p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 web3-dual-gradient-text-glow">
              <Award className="h-12 w-12 text-pink-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-center">WAGA Certification</h3>
              <p className="text-muted-foreground text-center">
                Receive official recognition for your contribution to the program
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 web3-dual-gradient-text-glow">
              <Lightbulb className="h-12 w-12 text-emerald-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-center">Innovative Learning</h3>
              <p className="text-muted-foreground text-center">
                Gain hands-on experience with blockchain, DeFi, and digital tools to solve real-world challenges.
              </p>
            </div>
            <div className="relative p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 web3-dual-gradient-text-glow">
              <Coffee className="h-12 w-12 text-orange-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-center">Cultural Immersion</h3>
              <p className="text-muted-foreground text-center">
                Participate in Ethiopia's coffee culture, including traditional ceremonies and farm visits.
              </p>
            </div>
            <div className="relative p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 web3-dual-gradient-text-glow">
              <Globe className="h-12 w-12 text-indigo-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-center">Global Impact</h3>
              <p className="text-muted-foreground text-center">
                Collaborate with international experts and local communities to create sustainable solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-dual-gradient-text-glow text-center">
            Why Volunteer?
          </h2>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join us in making a lasting impact on smallholder farmers in Ethiopia's coffee industry
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 w-full pt-8">
              <Card className="web3-card-purple">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Heart className="h-10 w-10 text-purple-400 mb-2" />
                  <CardTitle className="card-title text-foreground">Make a Real Impact</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Help smallholder farmers access better markets, fair financing, and traceability solutions
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="web3-card-teal">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Coffee className="h-10 w-10 text-teal-400 mb-2" />
                  <CardTitle className="card-title text-foreground">Experience Coffee Culture</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Live in Ethiopia's coffee-producing regions, visit farms, and experience the famous Ethiopian coffee
                    ceremony
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="web3-card-blue">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Globe className="h-10 w-10 text-blue-400 mb-2" />
                  <CardTitle className="card-title text-foreground">Global Web3 Initiative</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Network with like-minded blockchain pioneers while building real-world Web3 applications
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="web3-card-pink">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Lightbulb className="h-10 w-10 text-pink-400 mb-2" />
                  <CardTitle className="card-title text-foreground">Deeper Understanding</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Learn how blockchain and DeFi can solve real-world economic challenges beyond speculation
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Program Schedule Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-dual-gradient-text-glow text-center">
            Program Schedule & Timeline
          </h2>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our structured program ensures a meaningful experience for both volunteers and participants.
              </p>
            </div>
            <div className="w-full max-w-3xl pt-8">
              <Tabs defaultValue="phase1" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="phase1">Sprint 1</TabsTrigger>
                  <TabsTrigger value="phase2">Sprint 2</TabsTrigger>
                  <TabsTrigger value="phase3">Sprint 3</TabsTrigger>
                  <TabsTrigger value="phase4">Sprint 4</TabsTrigger>
                </TabsList>

                {/* Sprint 1 */}
                <TabsContent value="phase1" className="p-4 border rounded-md mt-2 web3-card-purple">
                  <h3 className="text-lg font-bold web3-gradient-text">Pre-arrival Training & Orientation</h3>
                  <p className="text-muted-foreground mt-2">
                    Virtual sessions to prepare participants with background knowledge and logistics for the program.
                  </p>
                </TabsContent>

                {/* Sprint 2 */}
                <TabsContent value="phase2" className="p-4 border rounded-md mt-2 web3-card-blue">
                  <h3 className="text-lg font-bold web3-gradient-text">Problem Discovery Phase – "Observe & Understand"</h3>
                  <p className="text-muted-foreground mt-2">
                    Field visits and workshops to understand challenges in the coffee value chain.
                  </p>
                </TabsContent>

                {/* Sprint 3 */}
                <TabsContent value="phase3" className="p-4 border rounded-md mt-2 web3-card-teal">
                  <h3 className="text-lg font-bold web3-gradient-text">Problem Analysis Phase – "Break it Down"</h3>
                  <p className="text-muted-foreground mt-2">
                    Collaborative sessions to analyze challenges and explore potential solutions using Web3 tools.
                  </p>
                </TabsContent>

                {/* Sprint 4 */}
                <TabsContent value="phase4" className="p-4 border rounded-md mt-2 web3-card-pink">
                  <h3 className="text-lg font-bold web3-gradient-text">Problem Improvement Phase – "Design, Build & Showcase"</h3>
                  <p className="text-muted-foreground mt-2">
                    Prototyping and presenting solutions, followed by post-camp activities like knowledge transfer and future planning.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Framework Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-dual-gradient-text-glow text-center">
            WAGA Summer Camp Curriculum Framework
          </h2>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore our three-phase experiential learning model designed to empower participants to co-learn, co-analyze, and co-create solutions.
              </p>
            </div>
          </div>
          <div className="relative pt-12">
            {/* Interactive Collapsible Cards */}
            <div className="space-y-6">
              {[
                {
                  id: 1,
                  title: "Problem Discovery Phase – \"Observe & Understand\"",
                  gradient: "from-purple-500/80 via-purple-400/80 to-purple-300/80",
                  goal: "Introduce participants to the real-world context of Ethiopian coffee farming and supply chains.",
                  activities: [
                    "Field visits to farms, washing stations, cooperatives.",
                    "Interviews with farmers, youth, processors, and traders.",
                    "Workshops on supply chain structure, transparency gaps, and digital literacy.",
                  ],
                  outcomes: [
                    "First-hand understanding of challenges in the coffee sector.",
                    "Problem framing based on lived experiences and community insights.",
                  ],
                },
                {
                  id: 2,
                  title: "Problem Analysis Phase – \"Break it Down\"",
                  gradient: "from-blue-500/80 via-blue-400/80 to-blue-300/80",
                  goal: "Analyze the discovered challenges using tools from blockchain, DeFi, traceability, and digital infrastructure.",
                  activities: [
                    "Design thinking and systems-mapping sessions.",
                    "Introductions to Web3 concepts (wallets, smart contracts, DAOs, DeFi, etc.).",
                    "Case studies on existing blockchain impact projects.",
                    "Group work on mapping problems to potential tech-based or process solutions.",
                  ],
                  outcomes: [
                    "Deeper understanding of root causes and potential leverage points.",
                    "Team formation and problem statements ready for prototyping.",
                  ],
                },
                {
                  id: 3,
                  title: "Problem Improvement Phase – \"Design, Build & Showcase\"",
                  gradient: "from-teal-500/80 via-teal-400/80 to-teal-300/80",
                  goal: "Prototype and present tech-enabled or process-enhancing solutions.",
                  activities: [
                    "Hackathon-style solution development sprint.",
                    "Mentorship from WAGA contributors and global experts.",
                    "Prototyping of smart contracts, apps, training tools, or supply chain models.",
                    "Demo Day: Teams present to local stakeholders and international observers.",
                  ],
                  outcomes: [
                    "Working MVPs, mock-ups, or policy proposals.",
                    "Stronger capacity for digital entrepreneurship and innovation.",
                    "Seeded relationships for post-camp collaboration.",
                  ],
                },
              ].map((phase) => {
                const [isOpen, setIsOpen] = useState(false);
                return (
                  <div key={phase.id} className="border rounded-lg overflow-hidden">
                    <button
                      className={`w-full p-4 text-left font-bold text-white bg-gradient-to-r ${phase.gradient} hover:opacity-80 transition-opacity`}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {phase.id}️⃣ {phase.title}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-gradient-to-r from-gray-900/50 via-gray-800/30 to-gray-900/50 text-white backdrop-blur-md">
                        <p>
                          <strong>Goal:</strong> {phase.goal}
                        </p>
                        <h4 className="mt-4 font-bold">🛠️ Activities:</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          {phase.activities.map((activity, index) => (
                            <li key={index}>{activity}</li>
                          ))}
                        </ul>
                        <h4 className="mt-4 font-bold">📚 Outcomes:</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          {phase.outcomes.map((outcome, index) => (
                            <li key={index}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Who We're Looking For Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30 -mt-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-dual-gradient-text-glow text-center">
            Who Are We Looking For?
          </h2>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We welcome volunteers from all backgrounds, particularly those with expertise in:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="primary-gradient text-white">
                    Blockchain & Web3
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="primary-gradient text-white">
                    DeFi & Lending
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="primary-gradient text-white">
                    Supply Chain & IoT
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="primary-gradient text-white">
                    Smart Contracts
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="primary-gradient text-white">
                    Financial Inclusion
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="primary-gradient text-white">
                    Sustainable Agriculture
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="primary-gradient text-white">
                    Digital Marketing
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="primary-gradient text-white">
                    Community Building
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground italic mt-4">
                No prior experience in coffee is required – just a passion for impact-driven Web3 solutions!
              </p>
              <div className="pt-4">
                <Button asChild size="lg" className="web3-button-purple">
                  <Link href="/summer-camp/register">Apply Now</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
              <BlockchainPlaceholder
                height={400}
                variant="grid"
                nodeCount={16}
                alt="WAGA Summer Camp Volunteers blockchain visualization"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-dual-gradient-text-glow text-center">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Find answers to common questions about the WAGA Summer Camp
              </p>
            </div>
            <div className="w-full max-w-3xl pt-8">
              <Accordion type="single" collapsible>
                <AccordionItem value="faq1">
                  <AccordionTrigger className="text-lg font-bold web3-gradient-text">
                    What is the duration of the program?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground mt-2">
                    The WAGA Summer Camp runs from July to September 2024. Volunteers can choose flexible 2-4 week participation windows, with multiple start dates available. This ensures that you can join the program at a time that works best for your schedule and commitments.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq2">
                  <AccordionTrigger className="text-lg font-bold web3-gradient-text">
                    Do I need prior experience in Web3?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground mt-2">
                    No prior experience in Web3 is required. We welcome volunteers from all backgrounds, whether you're a blockchain expert or completely new to the field. Our program includes comprehensive training and mentorship to ensure you are well-prepared to contribute meaningfully to the program's goals.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq3">
                  <AccordionTrigger className="text-lg font-bold web3-gradient-text">
                    What is included in the program?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground mt-2">
                    The program includes pre-arrival training, field visits to coffee farms, interactive workshops, and mentorship sessions. You'll also have the opportunity to collaborate with local farmers and global Web3 experts to create impactful solutions. Accommodation, local transportation, and some meals are also provided during the program.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq4">
                  <AccordionTrigger className="text-lg font-bold web3-gradient-text">
                    How do I apply?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground mt-2">
                    Applying is simple! Click the "Register Now" button on this page to access the application form. Fill out your details, and our team will review your application. Once accepted, you'll receive further instructions on how to prepare for the program, including travel arrangements and pre-arrival training.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-dual-gradient-text-glow text-center">
            Join Us in Transforming the Future of Coffee & Web3!
          </h2>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                By volunteering at WAGA Summer Camp, you're not just teaching Web3 – you're empowering farmers, shaping
                sustainable economies, and revolutionizing global trade.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="web3-button-purple">
                <Link href="/summer-camp/register">Apply Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-purple-500/30 hover:border-purple-500/60">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Application Deadline: June 15, 2024 | Spots are limited!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
