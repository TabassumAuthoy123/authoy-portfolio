package com.example.authoyportfolio.ui.screens

import android.content.Intent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.QrCode2
import androidx.compose.material.icons.filled.Share
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
import com.example.authoyportfolio.data.model.Profile
import com.example.authoyportfolio.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShareScreen(
    onBack: () -> Unit,
    repository: DataRepository = DefaultDataRepository()
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var profile by remember { mutableStateOf<Profile?>(null) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        try {
            profile = repository.getProfile()
        } catch (e: Exception) {
            // Silence
        } finally {
            isLoading = false
        }
    }

    val websiteUrl = "https://tabassumauthoy123.github.io/authoy-portfolio" // Default fallback or dynamic
    val qrCodeApiUrl = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&color=0d9488&data=$websiteUrl"
    
    val brush = Brush.linearGradient(colors = listOf(Teal500, Cyan500))

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Share Portfolio", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Teal400)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkNavy,
                    titleContentColor = Teal400
                )
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
            } else {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 24.dp),
                        colors = CardDefaults.cardColors(containerColor = DarkSurface),
                        border = BorderStroke(1.dp, DarkBorder)
                    ) {
                        Column(
                            modifier = Modifier
                                .padding(24.dp)
                                .fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "Scan QR Code",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            
                            Text(
                                text = "Scan this code to instantly open Tabassum's live portfolio on any mobile browser.",
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSecondary,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
                            )

                            // QR Code image
                            Box(
                                modifier = Modifier
                                    .size(200.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color.White)
                                    .border(BorderStroke(2.dp, brush), RoundedCornerShape(12.dp))
                                    .padding(8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                AsyncImage(
                                    model = qrCodeApiUrl,
                                    contentDescription = "QR Code",
                                    contentScale = ContentScale.Fit,
                                    modifier = Modifier.fillMaxSize()
                                )
                            }

                            Spacer(modifier = Modifier.height(20.dp))

                            Text(
                                text = websiteUrl,
                                style = MaterialTheme.typography.bodyMedium,
                                color = Cyan400,
                                fontWeight = FontWeight.SemiBold,
                                textAlign = TextAlign.Center
                            )
                        }
                    }

                    // Share Website Link Button
                    Button(
                        onClick = {
                            val intent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_SUBJECT, "Tabassum Authoy - Portfolio")
                                putExtra(Intent.EXTRA_TEXT, "Check out Tabassum Authoy's professional portfolio: $websiteUrl")
                            }
                            context.startActivity(Intent.createChooser(intent, "Share via"))
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Teal500),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Share Website Link", fontWeight = FontWeight.Bold)
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Share Contact Card vCard Button
                    OutlinedButton(
                        onClick = {
                            val vcardText = """
                                BEGIN:VCARD
                                VERSION:3.0
                                N:Mustafa Authoy;Tabassum;;;
                                FN:Tabassum Mustafa Authoy
                                ORG:Software Developer
                                TITLE:${profile?.title ?: "Software Developer"}
                                TEL;TYPE=CELL:${profile?.phone ?: ""}
                                EMAIL;TYPE=INTERNET:${profile?.email ?: ""}
                                URL:$websiteUrl
                                END:VCARD
                            """.trimIndent()

                            val intent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/x-vcard"
                                putExtra(Intent.EXTRA_TEXT, vcardText)
                                putExtra(Intent.EXTRA_SUBJECT, "Tabassum Authoy Contact vCard")
                            }
                            context.startActivity(Intent.createChooser(intent, "Export Contact Card"))
                        },
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                        border = BorderStroke(1.dp, Teal500),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                    ) {
                        Icon(Icons.Default.QrCode2, contentDescription = null, tint = Teal400)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Export Digital Contact Card", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
