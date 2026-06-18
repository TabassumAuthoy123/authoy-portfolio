package com.example.authoyportfolio.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.authoyportfolio.data.AuthManager
import com.example.authoyportfolio.data.DataRepository
import com.example.authoyportfolio.data.DefaultDataRepository
import com.example.authoyportfolio.data.model.DashboardAnalytics
import com.example.authoyportfolio.data.model.RecentActivity
import com.example.authoyportfolio.theme.*
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen(
    onBack: () -> Unit,
    onViewMessages: () -> Unit,
    onLogout: () -> Unit,
    authManager: AuthManager,
    repository: DataRepository = DefaultDataRepository()
) {
    val coroutineScope = rememberCoroutineScope()
    var analytics by remember { mutableStateOf<DashboardAnalytics?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    fun loadAnalytics() {
        coroutineScope.launch {
            isLoading = true
            errorMsg = null
            try {
                val token = authManager.tokenFlow.firstOrNull()
                if (token != null) {
                    analytics = repository.getDashboardAnalytics(token)
                } else {
                    errorMsg = "Not authenticated"
                    onLogout()
                }
            } catch (e: Exception) {
                errorMsg = e.localizedMessage ?: "Failed to load dashboard data"
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(Unit) {
        loadAnalytics()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Admin Dashboard", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Teal400)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkNavy,
                    titleContentColor = Teal400
                ),
                actions = {
                    IconButton(onClick = { loadAnalytics() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = Teal400)
                    }
                    IconButton(
                        onClick = {
                            coroutineScope.launch {
                                authManager.clearToken()
                                onLogout()
                            }
                        }
                    ) {
                        Icon(Icons.Default.Logout, contentDescription = "Log Out", tint = Red500)
                    }
                }
            )
        },
        containerColor = DarkNavy
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = Teal400
                )
            } else if (errorMsg != null) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = errorMsg ?: "",
                        color = MaterialTheme.colorScheme.error,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )
                    Button(
                        onClick = { loadAnalytics() },
                        colors = ButtonDefaults.buttonColors(containerColor = Teal500)
                    ) {
                        Text("Retry")
                    }
                }
            } else {
                analytics?.let { stats ->
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(20.dp)
                    ) {
                        // Quick Action Buttons
                        item {
                            Button(
                                onClick = onViewMessages,
                                colors = ButtonDefaults.buttonColors(containerColor = Teal500),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(52.dp)
                            ) {
                                Icon(Icons.Default.Email, contentDescription = null)
                                Spacer(modifier = Modifier.width(10.dp))
                                Text("View Contact Messages (${stats.unreadMessages} Unread)", fontWeight = FontWeight.Bold)
                            }
                        }

                        // Stats Summary Grid (Simulated with Columns and Rows)
                        item {
                            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                Text(
                                    text = "System Summary",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = Teal400,
                                    fontWeight = FontWeight.Bold
                                )

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    DashboardStatCard(
                                        title = "Projects",
                                        value = stats.totalProjects.toString(),
                                        icon = Icons.Default.Build,
                                        modifier = Modifier.weight(1f)
                                    )
                                    DashboardStatCard(
                                        title = "Skills",
                                        value = stats.totalSkills.toString(),
                                        icon = Icons.Default.Code,
                                        modifier = Modifier.weight(1f)
                                    )
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    DashboardStatCard(
                                        title = "Experience",
                                        value = stats.totalExperience.toString(),
                                        icon = Icons.Default.History,
                                        modifier = Modifier.weight(1f)
                                    )
                                    DashboardStatCard(
                                        title = "Total Messages",
                                        value = stats.totalMessages.toString(),
                                        icon = Icons.Default.Email,
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                            }
                        }

                        // Recent Activities Log
                        item {
                            Text(
                                text = "Recent Activities Log",
                                style = MaterialTheme.typography.titleMedium,
                                color = Teal400,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )
                        }

                        val activities = stats.recentActivities
                        if (activities.isNullOrEmpty()) {
                            item {
                                Card(
                                    modifier = Modifier.fillMaxWidth(),
                                    colors = CardDefaults.cardColors(containerColor = DarkSurface),
                                    border = BorderStroke(1.dp, DarkBorder)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(24.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("No recent activity recorded", color = TextSecondary)
                                    }
                                }
                            }
                        } else {
                            items(activities) { activity ->
                                ActivityLogItem(activity)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DashboardStatCard(
    title: String,
    value: String,
    icon: ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = DarkSurface),
        border = BorderStroke(1.dp, DarkBorder)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(title, style = MaterialTheme.typography.bodyMedium, color = TextSecondary)
                Icon(icon, contentDescription = null, tint = Cyan400, modifier = Modifier.size(20.dp))
            }
            Text(value, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = TextPrimary)
        }
    }
}

@Composable
fun ActivityLogItem(activity: RecentActivity) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkSurface),
        border = BorderStroke(1.dp, DarkBorder)
    ) {
        Row(
            modifier = Modifier
                .padding(12.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(Teal400)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "${activity.action} ${activity.resourceType}",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                activity.resourceTitle?.let { title ->
                    Text(
                        text = title,
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }
            }
            
            activity.createdAt?.let { dateStr ->
                Text(
                    text = dateStr.split("T").firstOrNull() ?: "",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextMuted,
                    fontSize = 11.sp
                )
            }
        }
    }
}
