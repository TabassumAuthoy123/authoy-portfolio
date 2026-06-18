package com.example.authoyportfolio

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import com.example.authoyportfolio.data.AuthManager
import com.example.authoyportfolio.ui.main.MainScreen
import com.example.authoyportfolio.ui.screens.*

@Composable
fun MainNavigation(authManager: AuthManager) {
  val backStack = rememberNavBackStack(Main)

  NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider =
      entryProvider {
        entry<Main> {
          MainScreen(
            onItemClick = { navKey -> backStack.add(navKey) },
            authManager = authManager
          )
        }
        
        entry<About> {
          AboutScreen(onBack = { backStack.removeLastOrNull() })
        }
        
        entry<Experience> {
          ExperienceScreen(onBack = { backStack.removeLastOrNull() })
        }
        
        entry<Achievements> {
          AchievementsScreen(onBack = { backStack.removeLastOrNull() })
        }
        
        entry<Contact> {
          ContactScreen(onBack = { backStack.removeLastOrNull() })
        }
        
        entry<Login> {
          LoginScreen(
            onBack = { backStack.removeLastOrNull() },
            onLoginSuccess = { 
              backStack.removeLastOrNull() 
              backStack.add(AdminDashboard)
            },
            authManager = authManager
          )
        }
        
        entry<AdminDashboard> {
          AdminDashboardScreen(
            onBack = { backStack.removeLastOrNull() },
            onViewMessages = { backStack.add(Messages) },
            onLogout = { backStack.removeLastOrNull() },
            authManager = authManager
          )
        }
        
        entry<Messages> {
          MessagesScreen(
            onBack = { backStack.removeLastOrNull() },
            authManager = authManager
          )
        }

        entry<AiAssistant> {
          AiAssistantScreen(onBack = { backStack.removeLastOrNull() })
        }

        entry<ShareQR> {
          ShareScreen(onBack = { backStack.removeLastOrNull() })
        }
      },
  )
}
