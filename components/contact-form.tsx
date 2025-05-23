"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { submitContactForm } from "@/lib/actions"

export function ContactForm() {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const onSubmit = async (data) => {
    try {
      setIsSubmittingForm(true)

      // Call the server action to submit the form
      const result = await submitContactForm(data)

      if (result.success) {
        toast({
          title: "Message sent!",
          description: result.message,
          variant: "default",
        })
        // Reset form
        reset()
      } else {
        toast({
          title: "Error",
          description: result.message || "Please check the form for errors",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingForm(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-[#D4A373]">
            Name
          </label>
          <input
            id="name"
            type="text"
            className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-500" : "border-[#D4A373]/20"} bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]`}
            placeholder="Your Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[#D4A373]">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-[#D4A373]/20"} bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]`}
            placeholder="Your Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-[#D4A373]">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          className={`w-full px-4 py-3 rounded-lg border ${errors.subject ? "border-red-500" : "border-[#D4A373]/20"} bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]`}
          placeholder="Subject"
          {...register("subject", { required: "Subject is required" })}
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-[#D4A373]">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className={`w-full px-4 py-3 rounded-lg border ${errors.message ? "border-red-500" : "border-[#D4A373]/20"} bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4A373]`}
          placeholder="Your Message"
          {...register("message", {
            required: "Message is required",
            minLength: {
              value: 10,
              message: "Message must be at least 10 characters",
            },
          })}
        ></textarea>
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <Button
        type="submit"
        className="w-full bg-[#D4A373] hover:bg-[#D4A373]/80 text-white"
        disabled={isSubmitting || isSubmittingForm}
      >
        {isSubmitting || isSubmittingForm ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
