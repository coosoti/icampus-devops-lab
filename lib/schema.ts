import {
    pgTable,
    uuid,
    text,
    boolean,
    integer,
    timestamp,
    primaryKey,
  } from "drizzle-orm/pg-core";
  import { relations } from "drizzle-orm";
  
  // ── Projects ───────────────────────────────────────────────────────────────────
  
  export const projects = pgTable("projects", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull().default(""),
    coverImage: text("cover_image"),
    stack: text("stack").array().notNull().default([]),
    overview: text("overview").notNull().default(""),
    architecture: text("architecture").notNull().default(""),
    ciCd: text("ci_cd").notNull().default(""),
    observability: text("observability").notNull().default(""),
    failureScenarios: text("failure_scenarios").array().notNull().default([]),
    githubUrl: text("github_url").notNull().default(""),
    demoUrl: text("demo_url"),
    featured: boolean("featured").notNull().default(false),
    likeCount: integer("like_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  });
  
  // ── Tags ───────────────────────────────────────────────────────────────────────
  
  export const tags = pgTable("tags", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    color: text("color").notNull().default("#3b82f6"),
  });
  
  // ── Project ↔ Tags join ────────────────────────────────────────────────────────
  
  export const projectTags = pgTable(
    "project_tags",
    {
      projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
      tagId: uuid("tag_id")
        .notNull()
        .references(() => tags.id, { onDelete: "cascade" }),
    },
    (table) => ({
      pk: primaryKey({ columns: [table.projectId, table.tagId] }),
    })
  );
  
  // ── Gallery images ─────────────────────────────────────────────────────────────
  
  export const galleryImages = pgTable("gallery_images", {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: text("caption"),
    position: integer("position").notNull().default(0),
  });
  
  // ── Likes ──────────────────────────────────────────────────────────────────────
  
  export const likes = pgTable("likes", {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    fingerprint: text("fingerprint").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  });
  
  // ── Comments ───────────────────────────────────────────────────────────────────
  
  export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    authorEmail: text("author_email").notNull(),
    body: text("body").notNull(),
    approved: boolean("approved").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  });
  
  // ── Relations ──────────────────────────────────────────────────────────────────
  
  export const projectsRelations = relations(projects, ({ many }) => ({
    projectTags: many(projectTags),
    gallery: many(galleryImages),
    likes: many(likes),
    comments: many(comments),
  }));
  
  export const tagsRelations = relations(tags, ({ many }) => ({
    projectTags: many(projectTags),
  }));
  
  export const projectTagsRelations = relations(projectTags, ({ one }) => ({
    project: one(projects, {
      fields: [projectTags.projectId],
      references: [projects.id],
    }),
    tag: one(tags, {
      fields: [projectTags.tagId],
      references: [tags.id],
    }),
  }));
  
  export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
    project: one(projects, {
      fields: [galleryImages.projectId],
      references: [projects.id],
    }),
  }));
  
  export const likesRelations = relations(likes, ({ one }) => ({
    project: one(projects, {
      fields: [likes.projectId],
      references: [projects.id],
    }),
  }));
  
  export const commentsRelations = relations(comments, ({ one }) => ({
    project: one(projects, {
      fields: [comments.projectId],
      references: [projects.id],
    }),
  }));