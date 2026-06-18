package com.example.authoyportfolio.data

import com.example.authoyportfolio.data.api.ApiClient
import com.example.authoyportfolio.data.model.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

interface DataRepository {
    suspend fun getProfile(): Profile
    suspend fun getProjects(): List<Project>
    suspend fun getSkills(): List<Skill>
    suspend fun getExperience(): List<Experience>
    suspend fun getAchievements(): List<Achievement>
    suspend fun getArticles(): List<Article>
    suspend fun sendContact(name: String, email: String, message: String): Map<String, String>
    suspend fun login(email: String, password: String): LoginResponse
    suspend fun getDashboardAnalytics(token: String): DashboardAnalytics
    suspend fun getMessages(token: String): List<Message>
    suspend fun markMessageRead(id: String, token: String): Map<String, String>
}

class DefaultDataRepository : DataRepository {
    private val json = Json { 
        ignoreUnknownKeys = true 
        coerceInputValues = true
    }

    override suspend fun getProfile(): Profile {
        return try {
            val res = ApiClient.api.getProfile()
            CacheManager.saveCache("profile", json.encodeToString(res))
            res
        } catch (e: Exception) {
            val cached = CacheManager.getCache("profile")
            if (cached != null) json.decodeFromString<Profile>(cached) else throw e
        }
    }
    
    override suspend fun getProjects(): List<Project> {
        return try {
            val res = ApiClient.api.getProjects()
            CacheManager.saveCache("projects", json.encodeToString(res))
            res
        } catch (e: Exception) {
            val cached = CacheManager.getCache("projects")
            if (cached != null) json.decodeFromString<List<Project>>(cached) else throw e
        }
    }
    
    override suspend fun getSkills(): List<Skill> {
        return try {
            val res = ApiClient.api.getSkills()
            CacheManager.saveCache("skills", json.encodeToString(res))
            res
        } catch (e: Exception) {
            val cached = CacheManager.getCache("skills")
            if (cached != null) json.decodeFromString<List<Skill>>(cached) else throw e
        }
    }
    
    override suspend fun getExperience(): List<Experience> {
        return try {
            val res = ApiClient.api.getExperience()
            CacheManager.saveCache("experience", json.encodeToString(res))
            res
        } catch (e: Exception) {
            val cached = CacheManager.getCache("experience")
            if (cached != null) json.decodeFromString<List<Experience>>(cached) else throw e
        }
    }
    
    override suspend fun getAchievements(): List<Achievement> {
        return try {
            val res = ApiClient.api.getAchievements()
            CacheManager.saveCache("achievements", json.encodeToString(res))
            res
        } catch (e: Exception) {
            val cached = CacheManager.getCache("achievements")
            if (cached != null) json.decodeFromString<List<Achievement>>(cached) else throw e
        }
    }
    
    override suspend fun getArticles(): List<Article> {
        return try {
            val res = ApiClient.api.getArticles()
            CacheManager.saveCache("articles", json.encodeToString(res))
            res
        } catch (e: Exception) {
            val cached = CacheManager.getCache("articles")
            if (cached != null) json.decodeFromString<List<Article>>(cached) else throw e
        }
    }
    
    override suspend fun sendContact(name: String, email: String, message: String): Map<String, String> {
        return ApiClient.api.sendContact(ContactRequest(name, email, message))
    }
    
    override suspend fun login(email: String, password: String): LoginResponse {
        return ApiClient.api.login(LoginRequest(email, password))
    }
    
    override suspend fun getDashboardAnalytics(token: String): DashboardAnalytics {
        return ApiClient.api.getDashboardAnalytics("Bearer $token")
    }
    
    override suspend fun getMessages(token: String): List<Message> {
        return ApiClient.api.getMessages("Bearer $token")
    }
    
    override suspend fun markMessageRead(id: String, token: String): Map<String, String> {
        return ApiClient.api.markMessageRead(id, "Bearer $token")
    }
}
