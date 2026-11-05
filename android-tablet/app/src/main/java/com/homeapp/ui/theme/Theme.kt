package com.homeapp.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Colors
val Primary = Color(0xFF3B82F6)
val PrimaryDark = Color(0xFF2563EB)
val Secondary = Color(0xFF10B981)
val Background = Color(0xFF0F172A)
val Surface = Color(0xFF1E293B)
val SurfaceVariant = Color(0xFF334155)
val OnBackground = Color(0xFFFFFFFF)
val OnSurface = Color(0xFFFFFFFF)
val OnSurfaceVariant = Color(0xFF94A3B8)

val Green400 = Color(0xFF4ADE80)
val Green500 = Color(0xFF22C55E)
val Amber400 = Color(0xFFFBBF24)
val Amber500 = Color(0xFFF59E0B)
val Red400 = Color(0xFFF87171)
val Blue400 = Color(0xFF60A5FA)
val Purple400 = Color(0xFFC084FC)
val Cyan400 = Color(0xFF22D3EE)

private val DarkColorScheme = darkColorScheme(
    primary = Primary,
    onPrimary = Color.White,
    primaryContainer = PrimaryDark,
    secondary = Secondary,
    onSecondary = Color.White,
    background = Background,
    onBackground = OnBackground,
    surface = Surface,
    onSurface = OnSurface,
    surfaceVariant = SurfaceVariant,
    onSurfaceVariant = OnSurfaceVariant
)

@Composable
fun HomeAppTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme
    val view = LocalView.current
    
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = Background.toArgb()
            window.navigationBarColor = Background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
