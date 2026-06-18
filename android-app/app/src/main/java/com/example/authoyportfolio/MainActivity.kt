package com.example.authoyportfolio

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.authoyportfolio.data.AuthManager
import com.example.authoyportfolio.data.CacheManager
import com.example.authoyportfolio.theme.AuthoyPortfolioTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    CacheManager.init(applicationContext)
    val authManager = AuthManager(applicationContext)

    enableEdgeToEdge()
    setContent {
      AuthoyPortfolioTheme { 
        Surface(
          modifier = Modifier.fillMaxSize(), 
          color = MaterialTheme.colorScheme.background
        ) { 
          MainNavigation(authManager = authManager) 
        } 
      }
    }
  }
}
