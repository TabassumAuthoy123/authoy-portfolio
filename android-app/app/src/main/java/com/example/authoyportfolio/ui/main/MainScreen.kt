package com.example.authoyportfolio.ui.main

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation3.runtime.NavKey
import com.example.authoyportfolio.*
import com.example.authoyportfolio.data.AuthManager
import com.example.authoyportfolio.ui.screens.ArticlesScreen
import com.example.authoyportfolio.ui.screens.HomeScreen
import com.example.authoyportfolio.ui.screens.ProjectsScreen
import com.example.authoyportfolio.ui.screens.SkillsScreen
import com.example.authoyportfolio.theme.*

enum class PortfolioTab(val title: String, val icon: ImageVector) {
    Home("Home", Icons.Default.Home),
    Skills("Skills", Icons.Default.Code),
    Projects("Projects", Icons.Default.Build),
    Articles("Articles", Icons.Default.Book),
    More("More", Icons.Default.Menu)
}

@Composable
fun MainScreen(
    onItemClick: (NavKey) -> Unit,
    authManager: AuthManager,
    modifier: Modifier = Modifier
) {
    var activeTab by remember { mutableStateOf(PortfolioTab.Home) }
    val authToken by authManager.tokenFlow.collectAsState(initial = null)

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = DarkSurface,
                tonalElevation = 8.dp
            ) {
                PortfolioTab.values().forEach { tab ->
                    val isSelected = activeTab == tab
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { activeTab = tab },
                        icon = {
                            Icon(
                                tab.icon,
                                contentDescription = tab.title,
                                tint = if (isSelected) Teal400 else TextSecondary
                            )
                        },
                        label = {
                            Text(
                                text = tab.title,
                                color = if (isSelected) Teal400 else TextSecondary,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                fontSize = 11.sp
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            indicatorColor = Teal500.copy(alpha = 0.15f)
                        )
                    )
                }
            }
        },
        containerColor = DarkNavy
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (activeTab) {
                PortfolioTab.Home -> {
                    HomeScreen(
                        onNavigateToSection = { target ->
                            when (target) {
                                "about" -> onItemClick(About)
                                "skills" -> activeTab = PortfolioTab.Skills
                                "projects" -> activeTab = PortfolioTab.Projects
                                "ai_assistant" -> onItemClick(AiAssistant)
                            }
                        }
                    )
                }
                PortfolioTab.Skills -> {
                    SkillsScreen()
                }
                PortfolioTab.Projects -> {
                    ProjectsScreen()
                }
                PortfolioTab.Articles -> {
                    ArticlesScreen()
                }
                PortfolioTab.More -> {
                    MoreMenuScreen(
                        onNavigate = { key -> onItemClick(key) },
                        isAdminLoggedIn = !authToken.isNullOrBlank()
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MoreMenuScreen(
    onNavigate: (NavKey) -> Unit,
    isAdminLoggedIn: Boolean
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("More Options", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkNavy,
                    titleContentColor = Teal400
                )
            )
        },
        containerColor = DarkNavy
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text(
                    "Discover sections and manage system settings.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }

            item {
                MenuOptionRow(
                    title = "About Me",
                    desc = "Biography, location, email, interests, and tags",
                    icon = Icons.Default.Info,
                    onClick = { onNavigate(About) }
                )
            }

            item {
                MenuOptionRow(
                    title = "Experience & Education",
                    desc = "Academic achievements and work history timelines",
                    icon = Icons.Default.School,
                    onClick = { onNavigate(Experience) }
                )
            }

            item {
                MenuOptionRow(
                    title = "Achievements & Awards",
                    desc = "Milestones, trophies, and certifications",
                    icon = Icons.Default.EmojiEvents,
                    onClick = { onNavigate(Achievements) }
                )
            }

            item {
                MenuOptionRow(
                    title = "Contact Form",
                    desc = "Get in touch directly with administrative messages",
                    icon = Icons.Default.Email,
                    onClick = { onNavigate(Contact) }
                )
            }

            item {
                MenuOptionRow(
                    title = "AI Portfolio Assistant",
                    desc = "Chat with a virtual clone of Authoy about her experience",
                    icon = Icons.Default.SmartToy,
                    onClick = { onNavigate(AiAssistant) }
                )
            }

            item {
                MenuOptionRow(
                    title = "Share Portfolio",
                    desc = "Generate QR code or export contact card vCard",
                    icon = Icons.Default.QrCode,
                    onClick = { onNavigate(ShareQR) }
                )
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
                Divider(color = DarkBorder, thickness = 1.dp)
                Spacer(modifier = Modifier.height(16.dp))
            }

            item {
                val targetKey = if (isAdminLoggedIn) AdminDashboard else Login
                val targetTitle = if (isAdminLoggedIn) "Admin Dashboard" else "Admin Login"
                val targetDesc = if (isAdminLoggedIn) "Manage analytics and read client messages" else "Authenticate with administrator credentials"
                val targetIcon = if (isAdminLoggedIn) Icons.Default.AdminPanelSettings else Icons.Default.Lock

                MenuOptionRow(
                    title = targetTitle,
                    desc = targetDesc,
                    icon = targetIcon,
                    onClick = { onNavigate(targetKey) }
                )
            }
        }
    }
}

@Composable
fun MenuOptionRow(
    title: String,
    desc: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = DarkSurface),
        border = BorderStroke(1.dp, DarkBorder)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                tint = Cyan400,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = desc,
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
            }
            Icon(
                Icons.Default.ArrowForwardIos,
                contentDescription = null,
                tint = TextMuted,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}
