package com.homeapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.homeapp.ui.screens.DashboardScreen
import com.homeapp.ui.screens.SetupScreen
import com.homeapp.ui.theme.HomeAppTheme

class MainActivity : ComponentActivity() {
    
    private val viewModel: HomeAppViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
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
}
