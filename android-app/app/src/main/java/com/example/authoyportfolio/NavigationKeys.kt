package com.example.authoyportfolio

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

@Serializable
data object Main : NavKey

@Serializable
data object About : NavKey

@Serializable
data object Experience : NavKey

@Serializable
data object Achievements : NavKey

@Serializable
data object Contact : NavKey

@Serializable
data object Login : NavKey

@Serializable
data object AdminDashboard : NavKey

@Serializable
data object Messages : NavKey
