"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const steps = [
  { title: "Create a Project", description: "Projects are the root workspace. Each project contains multiple containers." },
  { title: "Add a Container", description: "Containers run your apps. Configure image, ports, environment variables, and domains." },
  { title: "Manage Domains & Ports", description: "Easily attach custom domains, expose ports, and enable SSL using Traefik integration." },
  { title: "Finish Setup", description: "Confirm your setup and proceed to dashboard." },
]

const OnBoardingPage = () => {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const nextStep = () => {
    if (step === steps.length - 1) {
      router.push("/dashboard")
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => {
    if (step === 0) return
    setStep(step - 1)
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Card className="max-w-xl w-full bg-background/70 backdrop-blur-xl border-border/40">
        <CardHeader>
          <CardTitle className="text-2xl">{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].description}</CardDescription>

          {/* Progress */}
          <Progress value={((step + 1) / steps.length) * 100} className="mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">

          {/* STEP CONTENT */}
          {step === 0 && (
            <div>
              <p className="opacity-80">
                A project represents a workspace where you manage all your containers.  
                Create a project with a unique name.  
              </p>
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is a project?</AccordionTrigger>
                  <AccordionContent>
                    Projects group containers & configurations under one workspace.  
                    Example: <b>flamix-panel</b>, <b>flamix-web</b>.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="opacity-80">
                Containers run your applications.  
                Configure image, environment variables, domains, and ports.
              </p>
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="item-2">
                  <AccordionTrigger>How containers work</AccordionTrigger>
                  <AccordionContent>
                    Each container is built using Docker.  
                    Flamix automates networking, domains, SSL & deployment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="opacity-80">
                You can attach custom domains to your containers and expose ports.  
                SSL certificates are automatically handled via Traefik.
              </p>
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="item-3">
                  <AccordionTrigger>Domain & Port Example</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside">
                      <li>Domain: <b>app.example.com</b></li>
                      <li>Internal Port: <b>3000</b></li>
                      <li>HTTPS automatically enabled</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="opacity-80">
                You’re all set!  
                Review your setup and proceed to your dashboard.
              </p>
              <p className="mt-4 font-medium text-primary">Click finish to continue →</p>
            </div>
          )}

          <Separator />

          {/* ACTION BUTTONS */}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={prevStep} disabled={step === 0}>
              Back
            </Button>

            <Button onClick={nextStep}>
              {step === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default OnBoardingPage
