package com.example.authoyportfolio.data

import android.content.Context
import kotlinx.serialization.json.Json
import java.io.File

object CacheManager {
    private var appContext: Context? = null

    private val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
        encodeDefaults = true
    }

    fun init(context: Context) {
        appContext = context.applicationContext
    }

    fun saveCache(key: String, data: String) {
        val context = appContext ?: return
        try {
            val file = File(context.cacheDir, "$key.json")
            file.writeText(data)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun getCache(key: String): String? {
        val context = appContext ?: return null
        return try {
            val file = File(context.cacheDir, "$key.json")
            if (file.exists()) file.readText() else null
        } catch (e: Exception) {
            null
        }
    }
}
