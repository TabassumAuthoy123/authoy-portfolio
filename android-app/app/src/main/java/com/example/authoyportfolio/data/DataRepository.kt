package com.example.authoyportfolio.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

data class ProjectData(
    val title: String,
    val description: String,
    val techStack: List<String>
)

data class ExperienceData(
    val role: String,
    val company: String,
    val duration: String,
    val type: String
)

data class PortfolioData(
    val name: String,
    val title: String,
    val tagline: String,
    val bio: List<String>,
    val projects: List<ProjectData>,
    val experiences: List<ExperienceData>
)

interface DataRepository {
    val portfolioData: Flow<PortfolioData>
}

class DefaultDataRepository : DataRepository {
    private val baseUrl = "http://10.0.2.2:5000/api"

    override val portfolioData: Flow<PortfolioData> = flow {
        val data = fetchPortfolioFromApi()
        emit(data)
    }

    private suspend fun fetchPortfolioFromApi(): PortfolioData = withContext(Dispatchers.IO) {
        val profileJson = makeGetRequest("$baseUrl/profile")
        val projectsJson = makeGetRequest("$baseUrl/projects")
        val experiencesJson = makeGetRequest("$baseUrl/experience")

        // Parse profile
        val profileObj = JSONObject(profileJson)
        val name = profileObj.optString("name", "Tabassum Authoy")
        val title = profileObj.optString("title", "Project Coordinator & Software Engineer")
        val tagline = profileObj.optString("tagline", "Building digital experiences that inspire.")
        
        val bioArray = profileObj.optJSONArray("bio")
        val bio = mutableListOf<String>()
        if (bioArray != null) {
            for (i in 0 until bioArray.length()) {
                bio.add(bioArray.getString(i))
            }
        } else {
            val bioStr = profileObj.optString("bio", "")
            if (bioStr.isNotEmpty()) bio.add(bioStr)
        }

        // Parse projects
        val projectsList = mutableListOf<ProjectData>()
        try {
            val projectsArray = JSONArray(projectsJson)
            for (i in 0 until projectsArray.length()) {
                val projObj = projectsArray.getJSONObject(i)
                val projTitle = projObj.getString("title")
                val projDesc = projObj.getString("description")
                
                val techArray = projObj.optJSONArray("techStack")
                val techStack = mutableListOf<String>()
                if (techArray != null) {
                    for (j in 0 until techArray.length()) {
                        techStack.add(techArray.getString(j))
                    }
                }
                projectsList.add(ProjectData(projTitle, projDesc, techStack))
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // Parse experience
        val expList = mutableListOf<ExperienceData>()
        try {
            val expArray = JSONArray(experiencesJson)
            for (i in 0 until expArray.length()) {
                val expObj = expArray.getJSONObject(i)
                val role = expObj.getString("role")
                val company = expObj.getString("company")
                val duration = expObj.getString("duration")
                val type = expObj.getString("type")
                expList.add(ExperienceData(role, company, duration, type))
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        PortfolioData(name, title, tagline, bio, projectsList, expList)
    }

    private fun makeGetRequest(urlString: String): String {
        val url = URL(urlString)
        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "GET"
        connection.connectTimeout = 5000
        connection.readTimeout = 5000
        
        val responseCode = connection.responseCode
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return connection.inputStream.bufferedReader().use { it.readText() }
        } else {
            throw Exception("Failed to fetch data: HTTP $responseCode")
        }
    }
}
