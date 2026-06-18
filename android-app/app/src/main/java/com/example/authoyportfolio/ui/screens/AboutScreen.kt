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
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Mail
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
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

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun AboutScreen(
    onBack: () -> Unit,
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
                title = { Text("About Me", fontWeight = FontWeight.Bold) },
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
                    IconButton(onClick = { loadProfile() }) {
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
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Image and Key Info Header
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 12.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                val photoUrl = ApiClient.getImageUrl(prof.photoUrl)
                                val brush = Brush.linearGradient(colors = listOf(Teal500, Cyan500))

                                if (photoUrl != null) {
                                    AsyncImage(
                                        model = photoUrl,
                                        contentDescription = prof.name,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier
                                            .size(140.dp)
                                            .clip(CircleShape)
                                            .border(3.dp, brush, CircleShape)
                                    )
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Text(
                                    text = prof.name ?: "",
                                    style = MaterialTheme.typography.headlineSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )

                                Text(
                                    text = prof.title ?: "",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = Teal400,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }

                        // Info List (Location, Email, Phone)
                        item {
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = DarkSurface),
                                border = BorderStroke(1.dp, DarkBorder)
                            ) {
                                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                    prof.location?.let { loc ->
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.LocationOn, contentDescription = null, tint = Cyan400, modifier = Modifier.size(20.dp))
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Text(loc, color = TextPrimary)
                                        }
                                    }
                                    prof.email?.let { email ->
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.Mail, contentDescription = null, tint = Cyan400, modifier = Modifier.size(20.dp))
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Text(email, color = TextPrimary)
                                        }
                                    }
                                    prof.phone?.let { phone ->
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Default.Phone, contentDescription = null, tint = Cyan400, modifier = Modifier.size(20.dp))
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Text(phone, color = TextPrimary)
                                        }
                                    }
                                }
                            }
                        }

                        // Biography paragraphs
                        prof.bio?.let { bioList ->
                            item {
                                Text(
                                    text = "Biography",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = Teal400,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(bottom = 8.dp)
                                )
                            }
                            items(bioList) { paragraph ->
                                Text(
                                    text = paragraph,
                                    style = MaterialTheme.typography.bodyLarge,
                                    color = TextSecondary,
                                    lineHeight = 24.sp,
                                    modifier = Modifier.padding(bottom = 12.dp)
                                )
                            }
                        }

                        // Floating / Core Tags
                        prof.floatingTags?.let { tags ->
                            item {
                                Column {
                                    Text(
                                        text = "Interests & Keywords",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = Teal400,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(bottom = 12.dp)
                                    )
                                    FlowRow(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        tags.forEach { tag ->
                                            Box(
                                                modifier = Modifier
                                                    .background(DarkCard, RoundedCornerShape(20.dp))
                                                    .border(BorderStroke(1.dp, DarkBorder), RoundedCornerShape(20.dp))
                                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                                            ) {
                                                Text(
                                                    text = tag,
                                                    style = MaterialTheme.typography.bodyMedium,
                                                    color = Cyan400
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
