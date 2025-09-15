"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { buyerSchema, cityLabels, propertyTypeLabels, bhkLabels, purposeLabels, timelineLabels, sourceLabels, BuyerInput, BuyerUpdateInput } from '@/lib/validations/buyer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BHK, City, PropertyType, Purpose, Source, Timeline } from '@prisma/client'


interface BuyerFormProps {
  initialData?: Partial<BuyerUpdateInput>
}

export function BuyerForm({ initialData }: BuyerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      tags: [],
      ...initialData
    },
    mode: "onChange"
  })


  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setValue('tags', [...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    setValue('tags', newTags)
  }

  const onSubmit = async (data: BuyerInput) => {
    setIsSubmitting(true)
    try {
      const res = await axios.post(`/api/buyers`, data);
      console.log(res)
      router.push('/buyers')
    }
    catch (error) {
      console.error('Error Creating buyer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Buyer Lead'</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select onValueChange={(value) => setValue('city', value as City, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(cityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select onValueChange={(value) => setValue('propertyType', value as PropertyType, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(propertyTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.propertyType && (
                <p className="text-sm text-red-600">{errors.propertyType.message}</p>
              )}
            </div>


            <div className="space-y-2">
              <Label htmlFor="bhk">BHK *</Label>
              <Select onValueChange={(value) => setValue('bhk', value as BHK, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select BHK" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(bhkLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bhk && (
                <p className="text-sm text-red-600">{errors.bhk.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Select onValueChange={(value) => setValue('purpose', value as Purpose, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(purposeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.purpose && (
                <p className="text-sm text-red-600">{errors.purpose.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetMin">Budget Min (INR)</Label>
              <Input
                id="budgetMin"
                type="number"
                {...register('budgetMin', { valueAsNumber: true })}
                placeholder="Minimum budget"
              />
              {errors.budgetMin && (
                <p className="text-sm text-red-600">{errors.budgetMin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetMax">Budget Max (INR)</Label>
              <Input
                id="budgetMax"
                type="number"
                {...register('budgetMax', { valueAsNumber: true })}
                placeholder="Maximum budget"
              />
              {errors.budgetMax && (
                <p className="text-sm text-red-600">{errors.budgetMax.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline *</Label>
              <Select onValueChange={(value) => setValue('timeline', value as Timeline, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(timelineLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeline && (
                <p className="text-sm text-red-600">{errors.timeline.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Select onValueChange={(value) => setValue('source', value as Source, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(sourceLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.source && (
                <p className="text-sm text-red-600">{errors.source.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes..."
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Create Lead'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

