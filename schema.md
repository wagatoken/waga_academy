// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model User {
  id                 Int       @id @default(autoincrement())
  email              String    @unique
  passwordHash       String?   // Make optional or provide a default value
  firstName          String?   // Make optional or provide a default value
  lastName           String?   // Make optional or provide a default value
  role               UserRole  @default(STUDENT)
  isEmailVerified    Boolean   @default(false)
  verificationToken  String?
  resetPasswordToken String?
  resetPasswordExpires DateTime?
  walletAddress      String?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  lastLoginAt        DateTime?
  isActive           Boolean   @default(true)
  waitlists          Waitlist[]
  sessions           Session[]
  profile            Profile?
  courses            Course[]  @relation("InstructorCourses")
  enrollments        Enrollment[]
  resources          Resource[]
  organizedEvents    Event[]
  authoredTopics     ForumTopic[]  @relation("AuthorRelation") // Add this opposite relation
  lastPostTopics     ForumTopic[]  @relation("LastPostUserRelation") // Add this opposite relation
  posts              ForumPost[]
  notifications      Notification[]
  settings           Settings?
  auditLogs         AuditLog[]
  campRegistrations CampRegistration[]   
}

enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}

model Session {
  id          Int      @id @default(autoincrement())
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
  token       String    @unique
  expiresAt   DateTime
  ipAddress   String
  userAgent   String
  createdAt   DateTime  @default(now())
  lastActiveAt DateTime
  isRevoked   Boolean   @default(false)
}

model Profile {
  id          Int       @id @default(autoincrement())
  user        User      @relation(fields: [userId], references: [id])
  userId      Int       @unique
  bio         String?
  avatarUrl   String?
  jobTitle    String?
  company     String?
  location    String?
  website     String?
  socialLinks Json      // JSON object for social links (e.g., Twitter, LinkedIn, GitHub)
  skills      String[]  // Array of skills
  interests   String[]  // Array of interests
  education   Json      // JSON array for education details
  experience  Json      // JSON array for experience details
  visibility  ProfileVisibility @default(PUBLIC)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum ProfileVisibility {
  PUBLIC
  COMMUNITY
  PRIVATE
}

model Course {
  id                  Int          @id @default(autoincrement())
  title               String
  slug                String?      // Make optional or provide a default value
  description         String
  shortDescription    String?      // Make optional or provide a default value
  level               CourseLevel? // Make optional or provide a default value
  category            String?      // Make optional or provide a default value
  tags                String[]
  thumbnailUrl        String?      // Make optional or provide a default value
  instructor          User         @relation("InstructorCourses", fields: [instructorId], references: [id])
  instructorId        Int
  duration            Int?         // Make optional or provide a default value
  modules             Json?        // Make optional or provide a default value
  prerequisites       String[]     // Array of prerequisites
  objectives          String[]     // Array of objectives
  status              CourseStatus @default(DRAFT)
  featured            Boolean      @default(false)
  price               Float?
  enrollmentCount     Int          @default(0)
  maxEnrollments      Int?
  averageRating       Float        @default(0)
  hasWaitlist         Boolean      @default(false)
  waitlistEnabled     Boolean      @default(false)
  waitlistCount       Int          @default(0)
  maxWaitlistSize     Int?
  autoEnrollFromWaitlist Boolean   @default(false)
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt
  publishedAt         DateTime?
  waitlists             Waitlist[] 
  enrollments         Enrollment[]
}

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum CourseStatus {
  DRAFT
  REVIEW
  PUBLISHED
  ARCHIVED
}

model Enrollment {
  id              Int              @id @default(autoincrement())
  user            User             @relation(fields: [userId], references: [id])
  userId          Int
  course          Course           @relation(fields: [courseId], references: [id])
  courseId        Int
  enrolledAt      DateTime         @default(now())
  progress        Float            @default(0) // Progress percentage
  lastAccessedAt  DateTime?
  completedAt     DateTime?
  certificateId   String?          // Optional certificate ID
  status          EnrollmentStatus @default(ACTIVE)
  moduleProgress  Json?            // Make optional or provide a default value
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  DROPPED
  EXPIRED
}

model Waitlist {
  id                    Int           @id @default(autoincrement())
  course                Course        @relation(fields: [courseId], references: [id])
  courseId              Int
  user                  User?         @relation(fields: [userId], references: [id])
  userId                Int?
  email                 String?
  walletAddress         String?
  position              Int
  joinedAt              DateTime      @default(now())
  status                WaitlistStatus @default(ACTIVE)
  notificationSent      Boolean       @default(false)
  notificationSentAt    DateTime?
  convertedToEnrollment Boolean       @default(false)
  convertedAt           DateTime?
  notes                 String?
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
}

enum WaitlistStatus {
  ACTIVE
  INVITED
  ENROLLED
  EXPIRED
  DECLINED
}

model Resource {
  id            Int                @id @default(autoincrement())
  title         String
  description   String
  type          ResourceType
  category      String
  tags          String[]
  url           String
  thumbnailUrl  String?
  fileSize      Int?
  fileType      String?
  author        User               @relation(fields: [authorId], references: [id])
  authorId      Int
  visibility    ResourceVisibility @default(PUBLIC)
  downloadCount Int                @default(0)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
}

enum ResourceType {
  PDF
  VIDEO
  LINK
  IMAGE
  AUDIO
  DOCUMENT
  OTHER
}

enum ResourceVisibility {
  PUBLIC
  REGISTERED
  PREMIUM
}

model Event {
  id                   Int           @id @default(autoincrement())
  title                String
  description          String
  startDate            DateTime
  endDate              DateTime
  location             Json          // Store EventLocation as JSON
  type                 EventType
  category             String
  tags                 String[]
  imageUrl             String?
  organizer            User          @relation(fields: [organizerId], references: [id])
  organizerId          Int
  capacity             Int?
  registrationDeadline DateTime?
  registrationCount    Int           @default(0)
  status               EventStatus   @default(UPCOMING)
  isPublic             Boolean       @default(true)
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt
}

enum EventType {
  WEBINAR
  WORKSHOP
  CONFERENCE
  MEETUP
  COURSE
}

enum EventStatus {
  UPCOMING
  ONGOING
  COMPLETED
  CANCELLED
}

enum LocationType {
  PHYSICAL
  VIRTUAL
  HYBRID
}

model ForumCategory {
  id             Int       @id @default(autoincrement())
  name           String
  description    String
  slug           String    @unique
  order          Int
  topicCount     Int       @default(0)
  lastActivityAt DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  topics         ForumTopic[] 
}

model ForumTopic {
  id             Int       @id @default(autoincrement())
  category       ForumCategory @relation(fields: [categoryId], references: [id])
  categoryId     Int
  title          String
  slug           String    @unique
  author         User      @relation("AuthorRelation", fields: [authorId], references: [id]) // Add relation name
  authorId       Int
  content        String
  isPinned       Boolean   @default(false)
  isLocked       Boolean   @default(false)
  viewCount      Int       @default(0)
  postCount      Int       @default(0)
  lastPostAt     DateTime?
  lastPostUser   User?     @relation("LastPostUserRelation", fields: [lastPostUserId], references: [id]) // Add relation name
  lastPostUserId Int?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  posts          ForumPost[] 
}

model ForumPost {
  id          Int          @id @default(autoincrement())
  topic       ForumTopic   @relation(fields: [topicId], references: [id])
  topicId     Int
  author      User         @relation(fields: [authorId], references: [id])
  authorId    Int
  content     String
  parent      ForumPost?   @relation("ParentPost", fields: [parentId], references: [id]) // Define the parent relation
  parentId    Int?
  replies     ForumPost[]  @relation("ParentPost") // Define the replies relation
  isEdited    Boolean      @default(false)
  editedAt    DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Notification {
  id        Int              @id @default(autoincrement())
  user      User             @relation(fields: [userId], references: [id])
  userId    Int
  type      NotificationType
  title     String
  message   String
  isRead    Boolean          @default(false)
  data      Json?
  link      String?
  createdAt DateTime          @default(now())
}

enum NotificationType {
  COURSE
  FORUM
  EVENT
  SYSTEM
  ACHIEVEMENT
  WAITLIST
}

model Settings {
  id          Int       @id @default(autoincrement())
  user        User      @relation(fields: [userId], references: [id])
  userId      Int       @unique
  notifications Json    // Store notification preferences as JSON
  privacy      Json     // Store privacy settings as JSON
  theme        String
  language     String
  timezone     String
  updatedAt    DateTime  @default(now())
}

model AuditLog {
  id          Int       @id @default(autoincrement())
  user        User?     @relation(fields: [userId], references: [id])
  userId      Int?
  action      String
  entityType  String
  entityId    String?
  ipAddress   String
  userAgent   String
  oldValues   Json?
  newValues   Json?
  metadata    Json?
  timestamp   DateTime  @default(now())
}

model SummerCamp {
  id                   Int       @id @default(autoincrement())
  name                 String
  description          String
  startDate            DateTime
  endDate              DateTime
  location             String
  capacity             Int
  ageRange             Json      // Store age range as JSON
  price                Float
  earlyBirdPrice       Float?
  earlyBirdDeadline    DateTime?
  registrationDeadline DateTime
  status               CampStatus @default(UPCOMING)
  activities           String[]
  staff                Json      // Store staff details as JSON
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  registrations        CampRegistration[]
}

model CampRegistration {
  id                  Int              @id @default(autoincrement())
  camp                SummerCamp       @relation(fields: [campId], references: [id])
  campId              Int
  user                User             @relation(fields: [userId], references: [id])
  userId              Int
  childName           String
  childAge            Int
  emergencyContact    Json             // Store emergency contact as JSON
  medicalInformation  String?
  paymentStatus       PaymentStatus    @default(PENDING)
  paymentAmount       Float
  registeredAt        DateTime         @default(now())
  status              RegistrationStatus @default(PENDING)
}

enum CampStatus {
  UPCOMING
  ACTIVE
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
  FAILED
}

enum RegistrationStatus {
  PENDING
  CONFIRMED
  WAITLISTED
  CANCELLED
}