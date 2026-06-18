package com.example.authoyportfolio.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Profile(
    @SerialName("_id") val id: String? = null,
    val name: String? = null,
    val title: String? = null,
    val tagline: String? = null,
    val quote: String? = null,
    val email: String? = null,
    val phone: String? = null,
    val location: String? = null,
    val photoUrl: String? = null,
    val resumeUrl: String? = null,
    val githubUrl: String? = null,
    val linkedinUrl: String? = null,
    val bio: List<String>? = null,
    val floatingTags: List<String>? = null,
    val stats: List<ProfileStat>? = null,
)

@Serializable
data class ProfileStat(
    val icon: String? = null,
    val value: String? = null,
    val label: String? = null,
)

@Serializable
data class Project(
    @SerialName("_id") val id: String = "",
    val title: String = "",
    val description: String? = null,
    val techStack: List<String>? = null,
    val imageUrl: String? = null,
    val liveUrl: String? = null,
    val githubUrl: String? = null,
    val featured: Boolean = false,
    val order: Int = 0,
)

@Serializable
data class Skill(
    @SerialName("_id") val id: String = "",
    val name: String = "",
    val category: String = "",
    val icon: String? = null,
    val level: Int = 0,
    val order: Int = 0,
)

@Serializable
data class Experience(
    @SerialName("_id") val id: String = "",
    val role: String = "",
    val company: String = "",
    val duration: String = "",
    val description: String? = null,
    val type: String = "work",
    val order: Int = 0,
)

@Serializable
data class Achievement(
    @SerialName("_id") val id: String = "",
    val title: String = "",
    val description: String? = null,
    val icon: String? = null,
    val category: String? = null,
    val date: String? = null,
    val order: Int = 0,
)

@Serializable
data class Article(
    @SerialName("_id") val id: String = "",
    val title: String = "",
    val excerpt: String? = null,
    val content: String? = null,
    val category: String? = null,
    val coverImage: String? = null,
    val readTime: String? = null,
    val published: Boolean = false,
    val publishedAt: String? = null,
)

@Serializable
data class Message(
    @SerialName("_id") val id: String = "",
    val name: String = "",
    val email: String = "",
    val message: String = "",
    val read: Boolean = false,
    val createdAt: String? = null,
)

@Serializable
data class ContactRequest(
    val name: String,
    val email: String,
    val message: String,
)

@Serializable
data class LoginRequest(
    val email: String,
    val password: String,
)

@Serializable
data class LoginResponse(
    val token: String? = null,
    val message: String? = null,
)

@Serializable
data class DashboardAnalytics(
    val totalProjects: Int = 0,
    val totalSkills: Int = 0,
    val totalExperience: Int = 0,
    val totalAchievements: Int = 0,
    val totalArticles: Int = 0,
    val totalMessages: Int = 0,
    val unreadMessages: Int = 0,
    val recentActivities: List<RecentActivity>? = null,
)

@Serializable
data class RecentActivity(
    val action: String = "",
    val resourceType: String = "",
    val resourceTitle: String? = null,
    val createdAt: String? = null,
)
