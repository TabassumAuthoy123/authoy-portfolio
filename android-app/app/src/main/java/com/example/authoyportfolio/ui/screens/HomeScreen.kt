package com.example.authoyportfolio.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
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
import com.example.authoyportfolio.data.model.Profile
import com.example.authoyportfolio.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToSection: (String) -> Unit,
    repository: DataRepository = DefaultDataRepository()
) {
    val coroutineScope = rememberCoroutineScope()
    var profile by remember { mutableStateOf<Profile?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    fun loadProfile() {
        coroutineScope.launch {
            isLoading = true
            errorMsg = null
            try {
                profile = repository.getProfile()
            } catch (e: Exception) {
                errorMsg = e.localizedMessage ?: "Failed to load profile"
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(Unit) {
        loadProfile()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Authoy Portfolio", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkNavy,
                    titleContentColor = Teal400
                ),
                actions = {
                    IconButton(onClick = { loadProfile() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = Teal400)
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { onNavigateToSection("ai_assistant") },
                containerColor = Teal500,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.SmartToy, contentDescription = "AI Assistant")
            }
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
                        onClick = { loadProfile() },
                        colors = ButtonDefaults.buttonColors(containerColor = Teal500)
                    ) {
                        Text("Retry")
                    }
                }
            } else {
                profile?.let { prof ->
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(20.dp)
                    ) {
                        // Hero Section
                        item {
                            HeroSection(prof)
                        }

                        // Short bio / Quote
                        prof.quote?.let { quote ->
                            item {
                                Card(
                                    modifier = Modifier.fillMaxWidth(),
                                    colors = CardDefaults.cardColors(containerColor = DarkSurface),
                                    border = BorderStroke(1.dp, DarkBorder)
                                ) {
                                    Column(modifier = Modifier.padding(16.dp)) {
                                        Icon(
                                            Icons.Default.FormatQuote,
                                            contentDescription = null,
                                            tint = Teal400,
                                            modifier = Modifier.size(36.dp)
                                        )
                                        Text(
                                            text = quote,
                                            style = MaterialTheme.typography.bodyLarge.copy(
                                                fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                                                lineHeight = 24.sp
                                            ),
                                            color = TextPrimary,
                                            modifier = Modifier.padding(top = 8.dp)
                                        )
                                    }
                                }
                            }
                        }

                        // Profile Stats
                        prof.stats?.let { statsList ->
                            item {
                                Column {
                                    Text(
                                        text = "Highlights",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = Teal400,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(bottom = 8.dp)
                                    )
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        statsList.take(3).forEach { stat ->
                                            Card(
                                                modifier = Modifier.weight(1f),
                                                colors = CardDefaults.cardColors(containerColor = DarkCard),
                                                border = BorderStroke(1.dp, DarkBorder)
                                            ) {
                                                Column(
                                                    modifier = Modifier
                                                        .padding(12.dp)
                                                        .fillMaxWidth(),
                                                    horizontalAlignment = Alignment.CenterHorizontally
                                                ) {
                                                    Text(
                                                        text = stat.value ?: "",
                                                        style = MaterialTheme.typography.titleLarge,
                                                        color = Cyan400,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                    Text(
                                                        text = stat.label ?: "",
                                                        style = MaterialTheme.typography.bodySmall,
                                                        color = TextSecondary,
                                                        textAlign = TextAlign.Center,
                                                        modifier = Modifier.padding(top = 4.dp)
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // Social Links
                        item {
                            SocialLinksSection(prof)
                        }

                        // Quick Navigation / Sections
                        item {
                            Column {
                                Text(
                                    text = "Quick Navigation",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = Teal400,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(bottom = 8.dp)
                                )
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    QuickNavCard(title = "Detailed About Me", desc = "Read bio, floating tags and information details.", icon = Icons.Default.Info, target = "about", onNavigate = onNavigateToSection)
                                    QuickNavCard(title = "Professional Skills", desc = "View tech stack grouped by category and expertise levels.", icon = Icons.Default.Code, target = "skills", onNavigate = onNavigateToSection)
                                    QuickNavCard(title = "Featured Projects", desc = "Explore completed works with links and live deployments.", icon = Icons.Default.Build, target = "projects", onNavigate = onNavigateToSection)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun HeroSection(profile: Profile) {
    val brush = Brush.linearGradient(colors = listOf(Teal500, Cyan500))
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(DarkSurface)
            .border(BorderStroke(1.dp, DarkBorder), RoundedCornerShape(20.dp))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        val photoUrl = ApiClient.getImageUrl(profile.photoUrl)
        if (photoUrl != null) {
            AsyncImage(
                model = photoUrl,
                contentDescription = profile.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .size(120.dp)
                    .clip(CircleShape)
                    .border(2.dp, brush, CircleShape)
            )
        } else {
            Box(
                modifier = Modifier
                    .size(120.dp)
                    .clip(CircleShape)
                    .background(brush)
            ) {
                Icon(
                    Icons.Default.Person,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier
                        .size(60.dp)
                        .align(Alignment.Center)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = profile.name ?: "Tabassum Authoy",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = TextPrimary,
            textAlign = TextAlign.Center
        )

        Text(
            text = profile.title ?: "Software Developer & Engineer",
            style = MaterialTheme.typography.titleMedium,
            color = Teal400,
            fontWeight = FontWeight.SemiBold,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 4.dp)
        )

        Text(
            text = profile.tagline ?: "",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 8.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        profile.resumeUrl?.let { resume ->
            Button(
                onClick = {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(resume))
                    context.startActivity(intent)
                },
                colors = ButtonDefaults.buttonColors(containerColor = Teal500),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Download Resume")
            }
        }
    }
}

@Composable
fun SocialLinksSection(profile: Profile) {
    val context = LocalContext.current
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        profile.githubUrl?.let { url ->
            SocialIconButton(icon = Icons.Default.Language, label = "GitHub") {
                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
            }
        }
        profile.linkedinUrl?.let { url ->
            SocialIconButton(icon = Icons.Default.Share, label = "LinkedIn") {
                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
            }
        }
        profile.email?.let { email ->
            SocialIconButton(icon = Icons.Default.Email, label = "Email") {
                context.startActivity(Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:$email")))
            }
        }
        profile.phone?.let { phone ->
            SocialIconButton(icon = Icons.Default.Phone, label = "Phone") {
                context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone")))
            }
        }
    }
}

@Composable
fun SocialIconButton(icon: ImageVector, label: String, onClick: () -> Unit) {
    IconButton(
        onClick = onClick,
        modifier = Modifier
            .size(50.dp)
            .background(DarkCard, CircleShape)
            .border(1.dp, DarkBorder, CircleShape)
    ) {
        Icon(icon, contentDescription = label, tint = Teal400)
    }
}

@Composable
fun QuickNavCard(
    title: String,
    desc: String,
    icon: ImageVector,
    target: String,
    onNavigate: (String) -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onNavigate(target) },
        colors = CardDefaults.cardColors(containerColor = DarkCard),
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
                Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = TextPrimary)
                Text(desc, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
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
