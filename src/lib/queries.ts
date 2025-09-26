import { api, handleError } from './api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast'

// Types based on backend entities
export interface User {
  id: string
  email: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Cause {
  id: string
  title: string
  category: string
  description: string
  goalAmount: string
  raisedAmount: string
  status: 'active' | 'completed' | 'archived'
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface Donation {
  id: string
  amount: string
  donorName: string
  donorEmail: string
  causeId: string
  cause?: Cause
  createdAt?: string
}

export interface Volunteer {
  id: string
  name: string
  role?: string
  bio?: string
  imageUrl?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    website?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface Event {
  id: string
  title: string
  location: string
  date: string
  description?: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  message: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  createdAt?: string
}

export interface MediaItem {
  id: string
  url: string
  filename: string
  mimeType?: string
  size?: string
  createdAt?: string
  fullUrl?: string
}

// Query Keys
export const queryKeys = {
  causes: ['causes'] as const,
  cause: (id: string) => ['causes', id] as const,
  donations: ['donations'] as const,
  volunteers: ['volunteers'] as const,
  volunteer: (id: string) => ['volunteers', id] as const,
  events: ['events'] as const,
  event: (id: string) => ['events', id] as const,
  blogs: ['blogs'] as const,
  blog: (id: string) => ['blogs', id] as const,
  testimonials: ['testimonials'] as const,
  testimonial: (id: string) => ['testimonials', id] as const,
  contact: ['contact'] as const,
  media: ['media'] as const,
  stats: ['stats'] as const,
}

// Causes
export function useCauses() {
  return useQuery({
    queryKey: queryKeys.causes,
    queryFn: async () => {
      const response = await api.get<Cause[]>('/causes')
      return response.data
    },
  })
}

export function useCreateCause() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Cause, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post<Cause>('/causes', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.causes })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
      toast.success('Cause created successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useUpdateCause() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Cause> & { id: string }) => {
      const response = await api.put<Cause>(`/causes/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.causes })
      queryClient.invalidateQueries({ queryKey: queryKeys.cause(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
      toast.success('Cause updated successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useDeleteCause() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/causes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.causes })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
      toast.success('Cause deleted successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

// Donations
export function useDonations() {
  return useQuery({
    queryKey: queryKeys.donations,
    queryFn: async () => {
      const response = await api.get<Donation[]>('/donations')
      return response.data
    },
  })
}

export function useCreateDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Donation, 'id' | 'createdAt'>) => {
      const response = await api.post<Donation>('/donations', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.donations })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
      toast.success('Donation recorded successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

// Volunteers
export function useVolunteers() {
  return useQuery({
    queryKey: queryKeys.volunteers,
    queryFn: async () => {
      const response = await api.get<Volunteer[]>('/volunteers')
      return response.data
    },
  })
}

export function useCreateVolunteer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Volunteer, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post<Volunteer>('/volunteers', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.volunteers })
      toast.success('Volunteer added successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useUpdateVolunteer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Volunteer> & { id: string }) => {
      const response = await api.put<Volunteer>(`/volunteers/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.volunteers })
      queryClient.invalidateQueries({ queryKey: queryKeys.volunteer(variables.id) })
      toast.success('Volunteer updated successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useDeleteVolunteer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/volunteers/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.volunteers })
      toast.success('Volunteer deleted successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

// Events
export function useEvents() {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: async () => {
      const response = await api.get<Event[]>('/events')
      return response.data
    },
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post<Event>('/events', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events })
      toast.success('Event created successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Event> & { id: string }) => {
      const response = await api.put<Event>(`/events/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events })
      queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.id) })
      toast.success('Event updated successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/events/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events })
      toast.success('Event deleted successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

// Blogs
export function useBlogs() {
  return useQuery({
    queryKey: queryKeys.blogs,
    queryFn: async () => {
      const response = await api.get<Blog[]>('/blogs')
      return response.data
    },
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post<Blog>('/blogs', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
      toast.success('Blog created successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Blog> & { id: string }) => {
      const response = await api.put<Blog>(`/blogs/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
      queryClient.invalidateQueries({ queryKey: queryKeys.blog(variables.id) })
      toast.success('Blog updated successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
      toast.success('Blog deleted successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

// Testimonials
export function useTestimonials() {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: async () => {
      const response = await api.get<Testimonial[]>('/testimonials')
      return response.data
    },
  })
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post<Testimonial>('/testimonials', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials })
      toast.success('Testimonial created successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Testimonial> & { id: string }) => {
      const response = await api.put<Testimonial>(`/testimonials/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials })
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonial(variables.id) })
      toast.success('Testimonial updated successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/testimonials/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials })
      toast.success('Testimonial deleted successfully')
    },
    onError: (error) => {
      toast.error(handleError(error))
    },
  })
}

// Contact
export function useContact() {
  return useQuery({
    queryKey: queryKeys.contact,
    queryFn: async () => {
      const response = await api.get<Contact[]>('/contact')
      return response.data
    },
  })
}

// Media
export function useMedia(params?: { skip?: number; take?: number }) {
  return useQuery({
    queryKey: [...queryKeys.media, params],
    queryFn: async () => {
      const response = await api.get<MediaItem[]>('/media', { params })
      return response.data
    },
  })
}

// Stats
export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: async () => {
      const response = await api.get<{
        byCause: { causeId: string; title: string; total: string }[]
        overall: string
      }>('/donations/stats')
      return response.data
    },
  })
}
