package com.example.authoyportfolio.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = Teal400,
    onPrimary = DarkNavy,
    primaryContainer = Teal500,
    onPrimaryContainer = TextPrimary,
    secondary = Cyan400,
    onSecondary = DarkNavy,
    tertiary = Purple500,
    onTertiary = TextPrimary,
    background = DarkNavy,
    onBackground = TextPrimary,
    surface = DarkSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkCard,
    onSurfaceVariant = TextSecondary,
    outline = DarkBorder
)

@Composable
fun AuthoyPortfolioTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
