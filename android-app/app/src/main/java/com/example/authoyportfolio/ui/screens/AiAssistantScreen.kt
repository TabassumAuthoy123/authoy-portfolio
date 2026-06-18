package com.example.authoyportfolio.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.authoyportfolio.data.DataRepository
import com.example.authoyportfolio.data.DefaultDataRepository
import com.example.authoyportfolio.data.model.Profile
import com.example.authoyportfolio.data.model.Project
import com.example.authoyportfolio.data.model.Skill
import com.example.authoyportfolio.theme.*
import kotlinx.coroutines.launch

data class ChatMessage(
    val text: String,
    val isUser: Boolean,
    val timestamp: Long = System.currentTimeMillis()
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AiAssistantScreen(
    onBack: () -> Unit,
    repository: DataRepository = DefaultDataRepository()
) {
    val coroutineScope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    var profile by remember { mutableStateOf<Profile?>(null) }
    var skills by remember { mutableStateOf<List<Skill>>(emptyList()) }
    var projects by remember { mutableStateOf<List<Project>>(emptyList()) }

    var inputText by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            ChatMessage("Hello! I am Authoy's Virtual Assistant. Ask me anything about her skills, projects, or background!", false)
        )
    }

    LaunchedEffect(Unit) {
        try {
            profile = repository.getProfile()
            skills = repository.getSkills()
            projects = repository.getProjects()
        } catch (e: Exception) {
            // Keep empty, chatbot will fall back to static text
        }
    }

    fun handleSend() {
        if (inputText.isBlank()) return
        val userQuery = inputText.trim()
        messages.add(ChatMessage(userQuery, true))
        inputText = ""

        // Scroll to bottom
        coroutineScope.launch {
            listState.animateScrollToItem(messages.size - 1)
        }

        // Simulate AI response delay
        coroutineScope.launch {
            val responseText = generateBotResponse(userQuery, profile, skills, projects)
            messages.add(ChatMessage(responseText, false))
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.SmartToy, contentDescription = null, tint = Teal400)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Authoy AI Clone", fontWeight = FontWeight.Bold)
                    }
                },
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
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Messages List
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(messages) { message ->
                    BubbleMessage(message)
                }
            }

            // Input panel
            Surface(
                color = DarkSurface,
                border = BorderStroke(1.dp, DarkBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = inputText,
                        onValueChange = { inputText = it },
                        placeholder = { Text("Ask about skills, projects, info...", color = TextMuted) },
                        modifier = Modifier.weight(1f),
                        maxLines = 3,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                        keyboardActions = KeyboardActions(onSend = { handleSend() }),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedBorderColor = Teal400,
                            unfocusedBorderColor = DarkBorder
                        ),
                        shape = RoundedCornerShape(20.dp)
                    )
                    
                    Spacer(modifier = Modifier.width(8.dp))

                    IconButton(
                        onClick = { handleSend() },
                        enabled = inputText.isNotBlank(),
                        modifier = Modifier
                            .background(if (inputText.isNotBlank()) Teal500 else DarkCard, RoundedCornerShape(20.dp))
                    ) {
                        Icon(
                            Icons.Default.Send,
                            contentDescription = "Send",
                            tint = if (inputText.isNotBlank()) Color.White else TextMuted
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun BubbleMessage(message: ChatMessage) {
    val bubbleColor = if (message.isUser) Teal500 else DarkCard
    val alignment = if (message.isUser) Alignment.End else Alignment.Start
    val textColor = if (message.isUser) Color.White else TextPrimary
    val shape = if (message.isUser) {
        RoundedCornerShape(16.dp, 16.dp, 4.dp, 16.dp)
    } else {
        RoundedCornerShape(16.dp, 16.dp, 16.dp, 4.dp)
    }

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = alignment
    ) {
        Box(
            modifier = Modifier
                .clip(shape)
                .background(bubbleColor)
                .border(BorderStroke(1.dp, if (message.isUser) Color.Transparent else DarkBorder), shape)
                .padding(horizontal = 14.dp, vertical = 10.dp)
                .widthIn(max = 280.dp)
        ) {
            Text(
                text = message.text,
                style = MaterialTheme.typography.bodyMedium,
                color = textColor,
                lineHeight = 20.sp
            )
        }
    }
}

private fun generateBotResponse(
    query: String,
    profile: Profile?,
    skills: List<Skill>,
    projects: List<Project>
): String {
    val normalizedQuery = query.lowercase().trim()

    // 1. Greet / Identity
    if (normalizedQuery.contains("hi") || normalizedQuery.contains("hello") || normalizedQuery.contains("hey")) {
        return "Hello! I am Authoy's Virtual Assistant. How can I help you? You can ask about my skills, projects, biography, or contact details."
    }

    // 2. Skills Query
    if (normalizedQuery.contains("skill") || normalizedQuery.contains("tech") || normalizedQuery.contains("languages") || normalizedQuery.contains("framework")) {
        if (skills.isEmpty()) {
            return "Authoy is a highly skilled Software Developer experienced in modern frameworks like React, Node.js, Express, and Android Jetpack Compose."
        }
        val groupedSkills = skills.groupBy { it.category }
        val sb = StringBuilder("Here are my professional skills:\n")
        groupedSkills.forEach { (category, list) ->
            sb.append("\n• *$category*:\n")
            list.forEach { skill ->
                sb.append("  - ${skill.name} (${skill.level}%)\n")
            }
        }
        return sb.toString().trim()
    }

    // 3. Projects Query
    if (normalizedQuery.contains("project") || normalizedQuery.contains("portfolio") || normalizedQuery.contains("work")) {
        if (projects.isEmpty()) {
            return "I have worked on several software projects, including this portfolio CMS platform and Android companion applications. Check out the Projects tab for links!"
        }
        val sb = StringBuilder("Here are some of my featured projects:\n\n")
        projects.forEach { proj ->
            sb.append("• *${proj.title}*\n")
            proj.description?.let { sb.append("  $it\n") }
            proj.techStack?.let { sb.append("  _Stack: ${it.joinToString(", ")}_\n") }
            sb.append("\n")
        }
        return sb.toString().trim()
    }

    // 4. Biography / Info
    if (normalizedQuery.contains("bio") || normalizedQuery.contains("about") || normalizedQuery.contains("background") || normalizedQuery.contains("who are you")) {
        val name = profile?.name ?: "Tabassum Authoy"
        val title = profile?.title ?: "Software Developer"
        val tagline = profile?.tagline ?: ""
        val bio = profile?.bio?.joinToString(" ") ?: ""

        val sb = StringBuilder("I am $name, working as a $title.\n")
        if (tagline.isNotBlank()) sb.append("Tagline: \"$tagline\"\n\n")
        if (bio.isNotBlank()) sb.append(bio) else sb.append("I specialize in building full-stack web platforms and native mobile companion apps.")
        return sb.toString()
    }

    // 5. Contact Details
    if (normalizedQuery.contains("contact") || normalizedQuery.contains("email") || normalizedQuery.contains("phone") || normalizedQuery.contains("hire")) {
        val email = profile?.email ?: "tabassumauthoy12@gmail.com"
        val location = profile?.location ?: "Dhaka, Bangladesh"
        return "You can get in touch with me through:\n\n📧 *Email*: $email\n📍 *Location*: $location\n\nOr submit a quick message directly in the Contact form inside the app!"
    }

    // 6. Generic Fallback
    return "I am trained on Authoy's portfolio. Try asking 'Tell me about your projects', 'What are your skills?', or 'How can I contact you?'"
}
