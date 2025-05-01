"use client"

import { useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/providers/AuthProvider"
import { createReport } from "@/services/reportService"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CommunityPost() {
    const router = useRouter()
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState("")
    const [formData, setFormData] = useState({
        incedentType: "",
        description: "",
        incedentDate: "",
        location: {
            country: "",
            city: "",
            street: ""
        }
    })

    useEffect(() => {
        // Redirect if user is not logged in
        if (!user) {
            router.push("/log-in")
        }
    }, [user, router])

    const handleInputChange = (e) => {
        const { name, value } = e.target

        if (name.includes(".")) {
            const [parent, child] = name.split(".")
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate form
        if (!formData.incedentType) {
            setFormError("Please select an incident type")
            return
        }

        if (!formData.description) {
            setFormError("Please provide a description")
            return
        }

        if (!formData.incedentDate) {
            setFormError("Please provide the incident date")
            return
        }

        if (!formData.location.country || !formData.location.city) {
            setFormError("Please provide location details (at least country and city)")
            return
        }

        setLoading(true)
        setFormError("")

        try {
            // Prepare report data
            const reportData = {
                ...formData,
                owner: user.email,
                ownerName: user.name || user.displayName || "Anonymous",
                reportingDate: new Date().toISOString()
            }

            const result = await createReport(reportData)

            if (result) {
                // Redirect to community page after successful submission
                router.push("/community")
            } else {
                setFormError(result.message || "Failed to create report")
            }
        } catch (error) {
            console.error("Error submitting report:", error)
            setFormError("An error occurred while submitting your report")
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return null // Return nothing while redirecting
    }

    return (
        <div className="flex justify-center items-center py-10 px-4">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Report an Incident</CardTitle>
                    <CardDescription>
                        Share details about an incident to alert the community
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {formError && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-md">
                                {formError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="incedentType">Incident Type</Label>
                            <RadioGroup
                                id="incedentType"
                                name="incedentType"
                                value={formData.incedentType}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, incedentType: value }))}
                                className="flex flex-col space-y-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Natural Disaster" id="natural" />
                                    <Label htmlFor="natural">Natural Disaster</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Accident" id="accident" />
                                    <Label htmlFor="accident">Accident</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Violence" id="violence" />
                                    <Label htmlFor="violence">Violence</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Health Emergency" id="health" />
                                    <Label htmlFor="health">Health Emergency</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Other" id="other" />
                                    <Label htmlFor="other">Other</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe what happened..."
                                className="min-h-24"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="incedentDate">Incident Date</Label>
                            <Input
                                id="incedentDate"
                                name="incedentDate"
                                type="date"
                                value={formData.incedentDate}
                                onChange={handleInputChange}
                                max={new Date().toISOString().split('T')[0]} // Can't select future dates
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location.country">Country</Label>
                                <Input
                                    id="location.country"
                                    name="location.country"
                                    value={formData.location.country}
                                    onChange={handleInputChange}
                                    placeholder="Country"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location.city">City</Label>
                                <Input
                                    id="location.city"
                                    name="location.city"
                                    value={formData.location.city}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location.street">Street (Optional)</Label>
                            <Input
                                id="location.street"
                                name="location.street"
                                value={formData.location.street}
                                onChange={handleInputChange}
                                placeholder="Street or area details"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/community")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Report"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
