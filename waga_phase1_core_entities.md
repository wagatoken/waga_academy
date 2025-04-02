# WAGA Academy Platform – Phase 1 Core Entity Specifications

This document outlines the data models, entity relationships, validation rules, API endpoints, and implementation considerations for Phase 1 of the WAGA Academy platform.

## Core Entities

### User

```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}
```

### Session

```typescript
interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActiveAt: Date;
  isRevoked: boolean;
}
```

### Profile

```typescript
interface Profile {
  id: string;
  userId: string;
  bio?: string;
  avatarUrl?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  website?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  skills: string[];
  interests: string[];
  education: Education[];
  experience: Experience[];
  visibility: ProfileVisibility;
  createdAt: Date;
  updatedAt: Date;
}

enum ProfileVisibility {
  PUBLIC = 'public',
  COMMUNITY = 'community',
  PRIVATE = 'private'
}

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  location?: string;
}
```

### Course

```typescript
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  level: CourseLevel;
  category: string;
  tags: string[];
  thumbnailUrl: string;
  instructorId: string;
  duration: number;
  modules: Module[];
  prerequisites?: string[];
  objectives: string[];
  status: CourseStatus;
  featured: boolean;
  price?: number;
  enrollmentCount: number;
  maxEnrollments?: number;
  averageRating: number;
  hasWaitlist: boolean;
  waitlistEnabled: boolean;
  waitlistCount: number;
  maxWaitlistSize?: number;
  autoEnrollFromWaitlist: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

enum CourseStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  duration: number;
  order: number;
  isRequired: boolean;
}

enum LessonType {
  VIDEO = 'video',
  ARTICLE = 'article',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment'
}
```

### Enrollment

```typescript
interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  progress: number;
  lastAccessedAt?: Date;
  completedAt?: Date;
  certificateId?: string;
  status: EnrollmentStatus;
  moduleProgress: {
    moduleId: string;
    completed: boolean;
    lessonProgress: {
      lessonId: string;
      completed: boolean;
      lastAccessedAt?: Date;
    }[];
  }[];
}

enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
  EXPIRED = 'expired'
}
```

### Waitlist

```typescript
interface Waitlist {
  id: string;
  courseId: string;
  userId: string;
  email?: string;
  walletAddress?: string;
  position: number;
  joinedAt: Date;
  status: WaitlistStatus;
  notificationSent: boolean;
  notificationSentAt?: Date;
  convertedToEnrollment: boolean;
  convertedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum WaitlistStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  ENROLLED = 'enrolled',
  EXPIRED = 'expired',
  DECLINED = 'declined'
}
```

### Resource

```typescript
interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  tags: string[];
  url: string;
  thumbnailUrl?: string;
  fileSize?: number;
  fileType?: string;
  authorId: string;
  visibility: ResourceVisibility;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

enum ResourceType {
  PDF = 'pdf',
  VIDEO = 'video',
  LINK = 'link',
  IMAGE = 'image',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other'
}

enum ResourceVisibility {
  PUBLIC = 'public',
  REGISTERED = 'registered',
  PREMIUM = 'premium'
}
```


## 📅 Event

```ts
interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: EventLocation;
  type: EventType;
  category: string;
  tags: string[];
  imageUrl?: string;
  organizerId: string;
  capacity?: number;
  registrationDeadline?: Date;
  registrationCount: number;
  status: EventStatus;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EventLocation {
  type: LocationType;
  address?: string;
  city?: string;
  country?: string;
  virtualUrl?: string;
  virtualPlatform?: string;
}

enum LocationType {
  PHYSICAL = 'physical',
  VIRTUAL = 'virtual',
  HYBRID = 'hybrid'
}

enum EventType {
  WEBINAR = 'webinar',
  WORKSHOP = 'workshop',
  CONFERENCE = 'conference',
  MEETUP = 'meetup',
  COURSE = 'course'
}

enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

---

## 💬 Forum

```ts
interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  order: number;
  topicCount: number;
  lastActivityAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ForumTopic {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  authorId: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  postCount: number;
  lastPostAt?: Date;
  lastPostUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ForumPost {
  id: string;
  topicId: string;
  authorId: string;
  content: string;
  parentId?: string;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔔 Notification

```ts
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  link?: string;
  createdAt: Date;
}

enum NotificationType {
  COURSE = 'course',
  FORUM = 'forum',
  EVENT = 'event',
  SYSTEM = 'system',
  ACHIEVEMENT = 'achievement',
  WAITLIST = 'waitlist'
}
```

---

## ⚙️ Settings

```ts
interface Settings {
  id: string;
  userId: string;
  notifications: {
    email: boolean;
    browser: boolean;
    courseUpdates: boolean;
    forumActivity: boolean;
    events: boolean;
    waitlist: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: ProfileVisibility;
    showEnrollments: boolean;
    showActivities: boolean;
  };
  theme: string;
  language: string;
  timezone: string;
  updatedAt: Date;
}
```

---

## 🧾 AuditLog

```ts
interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  ipAddress: string;
  userAgent: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: Date;
}
```

---

## 🏕️ SummerCamp

```ts
interface SummerCamp {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  capacity: number;
  ageRange: {
    min: number;
    max: number;
  };
  price: number;
  earlyBirdPrice?: number;
  earlyBirdDeadline?: Date;
  registrationDeadline: Date;
  status: CampStatus;
  activities: string[];
  staff: {
    userId: string;
    role: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface CampRegistration {
  id: string;
  campId: string;
  userId: string;
  childName: string;
  childAge: number;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalInformation?: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  registeredAt: Date;
  status: RegistrationStatus;
}

enum CampStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

enum RegistrationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  WAITLISTED = 'waitlisted',
  CANCELLED = 'cancelled'
}
```
