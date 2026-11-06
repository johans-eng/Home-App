package com.homeapp

import android.os.Bundle
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.core.view.WindowCompat
import com.homeapp.ui.screens.DashboardScreen
import com.homeapp.ui.screens.SetupScreen
import com.homeapp.ui.theme.HomeAppTheme

class MainActivity : ComponentActivity() {
    
    private val viewModel: HomeAppViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Keep screen on 24/7
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        
        // Full screen immersive mode (hide status bar and navigation bar)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        setContent {
            HomeAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val isConfigured by viewModel.isConfigured.collectAsState()
                    val isConnected by viewModel.isConnected.collectAsState()
                    val appState by viewModel.appState.collectAsState()
                    val serverUrl by viewModel.serverUrl.collectAsState()
                    
                    if (!isConfigured) {
                        SetupScreen(
                            onServerUrlSubmit = { url ->
                                viewModel.setServerUrl(url)
                            }
                        )
                    } else {
                        DashboardScreen(
                            appState = appState,
                            isConnected = isConnected,
                            serverUrl = serverUrl,
                            onToggleTodo = { viewModel.toggleTodo(it) },
                            onToggleShopping = { viewModel.toggleShoppingItem(it) },
                            onChangeServer = { viewModel.setServerUrl("") }
                        )
                    }
                }
            }
        }
    }
    
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            hideSystemUI()
        }
    }
    
    override fun onResume() {
        super.onResume()
        hideSystemUI()
    }
    
    private fun hideSystemUI() {
        // For Android 11+ (API 30+)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            window.insetsController?.let { controller ->
                controller.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                controller.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            // For older Android versions
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            )
        }
    }
}
