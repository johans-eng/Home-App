package com.homeapp

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.homeapp.data.AppState
import com.homeapp.network.NetworkModule
import com.homeapp.network.SocketManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch

class HomeAppViewModel(application: Application) : AndroidViewModel(application) {
    
    private val prefs = application.getSharedPreferences("home_app_prefs", Context.MODE_PRIVATE)
    private val socketManager = SocketManager()
    
    private val _serverUrl = MutableStateFlow(prefs.getString("server_url", "") ?: "")
    val serverUrl: StateFlow<String> = _serverUrl
    
    private val _isConfigured = MutableStateFlow(prefs.getString("server_url", "")?.isNotEmpty() == true)
    val isConfigured: StateFlow<Boolean> = _isConfigured
    
    val isConnected: StateFlow<Boolean> = socketManager.connectionState
    val appState: StateFlow<AppState> = socketManager.appState
    
    init {
        if (_isConfigured.value) {
            connectToServer(_serverUrl.value)
        }
    }
    
    fun setServerUrl(url: String) {
        _serverUrl.value = url
        prefs.edit().putString("server_url", url).apply()
        _isConfigured.value = url.isNotEmpty()
        
        if (url.isNotEmpty()) {
            NetworkModule.setBaseUrl(url)
            connectToServer(url)
        }
    }
    
    private fun connectToServer(url: String) {
        socketManager.disconnect()
        socketManager.connect(url)
    }
    
    fun toggleTodo(todoId: String) {
        viewModelScope.launch {
            try {
                NetworkModule.getApiService().toggleTodo(todoId)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
    
    fun toggleShoppingItem(itemId: String) {
        viewModelScope.launch {
            try {
                NetworkModule.getApiService().toggleShoppingItem(itemId)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
    
    override fun onCleared() {
        super.onCleared()
        socketManager.disconnect()
    }
}
