package com.example.authoyportfolio.data

import com.example.authoyportfolio.data.api.ApiClient
import com.example.authoyportfolio.data.model.*

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
    override suspend fun getProfile(): Profile = ApiClient.api.getProfile()
    
    override suspend fun getProjects(): List<Project> = ApiClient.api.getProjects()
    
    override suspend fun getSkills(): List<Skill> = ApiClient.api.getSkills()
    
    override suspend fun getExperience(): List<Experience> = ApiClient.api.getExperience()
    
    override suspend fun getAchievements(): List<Achievement> = ApiClient.api.getAchievements()
    
    override suspend fun getArticles(): List<Article> = ApiClient.api.getArticles()
    
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
