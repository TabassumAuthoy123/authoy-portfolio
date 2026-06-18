package com.example.authoyportfolio.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Launch
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.authoyportfolio.data.DataRepository
import com.example.authoyportfolio.data.DefaultDataRepository
import com.example.authoyportfolio.data.api.ApiClient
import com.example.authoyportfolio.data.model.Project
import com.example.authoyportfolio.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProjectsScreen(
    repository: DataRepository = DefaultDataRepository()
) {
    val coroutineScope = rememberCoroutineScope()
    var projects by remember { mutableStateOf<List<Project>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    var showOnlyFeatured by remember { mutableStateOf(false) }

    fun loadProjects() {
        coroutineScope.launch {
            isLoading = true
            errorMsg = null
            try {
                projects = repository.getProjects().sortedBy { it.order }
            } catch (e: Exception) {
                errorMsg = e.localizedMessage ?: "Failed to load projects"
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(Unit) {
        loadProjects()
    }

    val displayedProjects = remember(projects, showOnlyFeatured) {
        if (showOnlyFeatured) {
            projects.filter { it.featured }
        } else {
            projects
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Projects", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkNavy,
                    titleContentColor = Teal400
                ),
                actions = {
                    IconButton(onClick = { loadProjects() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = Teal400)
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
                        onClick = { loadProjects() },
                        colors = ButtonDefaults.buttonColors(containerColor = Teal500)
                    ) {
                        Text("Retry")
                    }
                }
            } else {
                Column(modifier = Modifier.fillMaxSize()) {
                    // Filter Bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        FilterChip(
                            selected = !showOnlyFeatured,
                            onClick = { showOnlyFeatured = false },
                            label = { Text("All Work") },
                            colors = FilterChipDefaults.filterChipColors(
                                labelColor = TextSecondary,
                                selectedLabelColor = Color.White,
                                selectedContainerColor = Teal500
                            )
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        FilterChip(
                            selected = showOnlyFeatured,
                            onClick = { showOnlyFeatured = true },
                            label = { Text("Featured") },
                            leadingIcon = {
                                Icon(
                                    Icons.Default.Star,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                labelColor = TextSecondary,
                                selectedLabelColor = Color.White,
                                selectedContainerColor = Teal500
                            )
                        )
                    }

                    // List of Projects
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(20.dp)
                    ) {
                        if (displayedProjects.isEmpty()) {
                            item {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(40.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("No projects found.", color = TextSecondary)
                                }
                            }
                        } else {
                            items(displayedProjects) { project ->
                                ProjectCard(project)
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ProjectCard(project: Project) {
    val context = LocalContext.current
    val imageSrc = ApiClient.getImageUrl(project.imageUrl)
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkSurface),
        border = BorderStroke(1.dp, DarkBorder)
    ) {
        Column {
            // Project Image or Fallback Gradient
            if (imageSrc != null) {
                AsyncImage(
                    model = imageSrc,
                    contentDescription = project.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                )
            } else {
                val fallbackBrush = Brush.linearGradient(
                    colors = listOf(DarkCard, DarkNavy)
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .background(fallbackBrush)
                ) {
                    Icon(
                        Icons.Default.Build,
                        contentDescription = null,
                        tint = Teal500,
                        modifier = Modifier
                            .size(48.dp)
                            .align(Alignment.Center)
                    )
                }
            }

            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = project.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )

                    if (project.featured) {
                        Box(
                            modifier = Modifier
                                .background(Teal500.copy(alpha = 0.2f), RoundedCornerShape(12.dp))
                                .border(BorderStroke(1.dp, Teal400), RoundedCornerShape(12.dp))
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                "Featured",
                                color = Teal400,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                project.description?.let { desc ->
                    Text(
                        text = desc,
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary,
                        lineHeight = 20.sp
                    )
                }

                // Tech Stack Tags
                project.techStack?.let { stack ->
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        stack.forEach { tech ->
                            Box(
                                modifier = Modifier
                                    .background(DarkCard, RoundedCornerShape(4.dp))
                                    .border(BorderStroke(1.dp, DarkBorder), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = tech,
                                    fontSize = 11.sp,
                                    color = Cyan400
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    project.liveUrl?.let { liveUrl ->
                        if (liveUrl.isNotBlank()) {
                            Button(
                                onClick = {
                                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(liveUrl)))
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Teal500),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Launch, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Live Demo", fontSize = 12.sp)
                            }
                        }
                    }

                    project.githubUrl?.let { codeUrl ->
                        if (codeUrl.isNotBlank()) {
                            OutlinedButton(
                                onClick = {
                                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(codeUrl)))
                                },
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                                border = BorderStroke(1.dp, Teal500),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Code, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("GitHub", fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}
