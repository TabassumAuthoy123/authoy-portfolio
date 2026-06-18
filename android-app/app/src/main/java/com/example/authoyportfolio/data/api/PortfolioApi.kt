package com.example.authoyportfolio.data.api

import com.example.authoyportfolio.data.model.*
import retrofit2.http.*

interface PortfolioApi {

    // ── Public Endpoints ────────────────────
    @GET("profile")
    suspend fun getProfile(): Profile

    @GET("projects")
    suspend fun getProjects(): List<Project>

    @GET("skills")
    suspend fun getSkills(): List<Skill>

    @GET("experience")
    suspend fun getExperience(): List<Experience>

    @GET("achievements")
    suspend fun getAchievements(): List<Achievement>

    @GET("articles")
    suspend fun getArticles(): List<Article>

    @POST("contact")
    suspend fun sendContact(@Body request: ContactRequest): Map<String, String>

    // ── Admin Endpoints ─────────────────────
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @GET("dashboard/analytics")
    suspend fun getDashboardAnalytics(@Header("Authorization") token: String): DashboardAnalytics

    @GET("messages")
    suspend fun getMessages(@Header("Authorization") token: String): List<Message>

    @PUT("messages/{id}/read")
    suspend fun markMessageRead(
        @Path("id") id: String,
        @Header("Authorization") token: String,
    ): Map<String, String>
}
