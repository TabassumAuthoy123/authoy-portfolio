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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.MarkEmailRead
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.authoyportfolio.data.AuthManager
import com.example.authoyportfolio.data.DataRepository
import com.example.authoyportfolio.data.DefaultDataRepository
import com.example.authoyportfolio.data.model.Message
import com.example.authoyportfolio.theme.*
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MessagesScreen(
    onBack: () -> Unit,
    authManager: AuthManager,
    repository: DataRepository = DefaultDataRepository()
) {
    val coroutineScope = rememberCoroutineScope()
    var messages by remember { mutableStateOf<List<Message>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    
    var showOnlyUnread by remember { mutableStateOf(false) }

    fun loadMessages() {
        coroutineScope.launch {
            isLoading = true
            errorMsg = null
            try {
                val token = authManager.tokenFlow.firstOrNull()
                if (token != null) {
                    messages = repository.getMessages(token).sortedByDescending { it.createdAt }
                } else {
                    errorMsg = "Authentication token missing"
                }
            } catch (e: Exception) {
                errorMsg = e.localizedMessage ?: "Failed to retrieve messages"
            } finally {
                isLoading = false
            }
        }
    }

    fun markAsRead(msgId: String) {
        coroutineScope.launch {
            try {
                val token = authManager.tokenFlow.firstOrNull()
                if (token != null) {
                    repository.markMessageRead(msgId, token)
                    // Update locally
                    messages = messages.map {
                        if (it.id == msgId) it.copy(read = true) else it
                    }
                }
            } catch (e: Exception) {
                // Ignore silent failure or show simple toast
            }
        }
    }

    LaunchedEffect(Unit) {
        loadMessages()
    }

    val displayedMessages = remember(messages, showOnlyUnread) {
        if (showOnlyUnread) {
            messages.filter { !it.read }
        } else {
            messages
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Contact Messages", fontWeight = FontWeight.Bold) },
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
                    IconButton(onClick = { loadMessages() }) {
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
                        onClick = { loadMessages() },
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
                            selected = !showOnlyUnread,
                            onClick = { showOnlyUnread = false },
                            label = { Text("All Messages") },
                            colors = FilterChipDefaults.filterChipColors(
                                labelColor = TextSecondary,
                                selectedLabelColor = Color.White,
                                selectedContainerColor = Teal500
                            )
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        FilterChip(
                            selected = showOnlyUnread,
                            onClick = { showOnlyUnread = true },
                            label = { Text("Unread") },
                            colors = FilterChipDefaults.filterChipColors(
                                labelColor = TextSecondary,
                                selectedLabelColor = Color.White,
                                selectedContainerColor = Teal500
                            )
                        )
                    }

                    // Messages List
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        if (displayedMessages.isEmpty()) {
                            item {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(40.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("No messages found.", color = TextSecondary)
                                }
                            }
                        } else {
                            items(displayedMessages) { msg ->
                                MessageCard(
                                    message = msg,
                                    onMarkRead = { markAsRead(msg.id) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MessageCard(
    message: Message,
    onMarkRead: () -> Unit
) {
    val context = LocalContext.current
    val formattedDate = remember(message.createdAt) {
        message.createdAt?.split("T")?.firstOrNull() ?: ""
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DarkSurface),
        border = BorderStroke(1.dp, if (message.read) DarkBorder else Teal400)
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
                Text(
                    text = message.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = formattedDate,
                        style = MaterialTheme.typography.bodySmall,
                        color = TextMuted,
                        modifier = Modifier.padding(end = 8.dp)
                    )
                    
                    if (!message.read) {
                        Box(
                            modifier = Modifier
                                .background(Teal500, RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                "NEW",
                                color = Color.White,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // Clickable email link
            Text(
                text = message.email,
                style = MaterialTheme.typography.bodyMedium,
                color = Cyan400,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier
                    .clickable {
                        val intent = Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:${message.email}"))
                        context.startActivity(intent)
                    }
                    .padding(vertical = 2.dp)
            )

            Divider(color = DarkBorder, thickness = 0.5.dp, modifier = Modifier.padding(vertical = 4.dp))

            Text(
                text = message.message,
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                lineHeight = 20.sp
            )

            if (!message.read) {
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(
                        onClick = onMarkRead,
                        colors = ButtonDefaults.textButtonColors(contentColor = Teal400)
                    ) {
                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Mark as Read", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
