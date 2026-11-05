package com.homeapp.network

import android.util.Log
import com.google.gson.Gson
import com.homeapp.data.*
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import org.json.JSONObject

class SocketManager {
    private var socket: Socket? = null
    private val gson = Gson()
    
    private val _connectionState = MutableStateFlow(false)
    val connectionState: StateFlow<Boolean> = _connectionState
    
    private val _appState = MutableStateFlow(AppState())
    val appState: StateFlow<AppState> = _appState
    
    fun connect(serverUrl: String) {
        try {
            val options = IO.Options().apply {
                forceNew = true
                reconnection = true
                reconnectionAttempts = Int.MAX_VALUE
                reconnectionDelay = 1000
            }
            
            socket = IO.socket(serverUrl, options)
            
            socket?.on(Socket.EVENT_CONNECT) {
                Log.d("SocketManager", "Connected to server")
                _connectionState.value = true
            }
            
            socket?.on(Socket.EVENT_DISCONNECT) {
                Log.d("SocketManager", "Disconnected from server")
                _connectionState.value = false
            }
            
            socket?.on(Socket.EVENT_CONNECT_ERROR) { args ->
                Log.e("SocketManager", "Connection error: ${args.firstOrNull()}")
                _connectionState.value = false
            }
            
            // Initial state
            socket?.on("initial_state") { args ->
                args.firstOrNull()?.let { data ->
                    try {
                        val json = data as JSONObject
                        val initialState = gson.fromJson(json.toString(), InitialState::class.java)
                        _appState.value = AppState(
                            users = initialState.users,
                            appointments = initialState.appointments,
                            todos = initialState.todos,
                            shopping = initialState.shopping,
                            activity = initialState.activity
                        )
                    } catch (e: Exception) {
                        Log.e("SocketManager", "Error parsing initial state", e)
                    }
                }
            }
            
            // User events
            socket?.on("user_created") { args ->
                parseAndUpdateState<User>(args) { user ->
                    _appState.value = _appState.value.copy(
                        users = _appState.value.users + user
                    )
                }
            }
            
            socket?.on("user_updated") { args ->
                parseAndUpdateState<User>(args) { user ->
                    _appState.value = _appState.value.copy(
                        users = _appState.value.users.map { if (it.id == user.id) user else it }
                    )
                }
            }
            
            socket?.on("user_status_changed") { args ->
                parseAndUpdateState<User>(args) { user ->
                    _appState.value = _appState.value.copy(
                        users = _appState.value.users.map { if (it.id == user.id) user else it }
                    )
                }
            }
            
            // Appointment events
            socket?.on("appointment_created") { args ->
                parseAndUpdateState<Appointment>(args) { appointment ->
                    _appState.value = _appState.value.copy(
                        appointments = _appState.value.appointments + appointment
                    )
                }
            }
            
            socket?.on("appointment_updated") { args ->
                parseAndUpdateState<Appointment>(args) { appointment ->
                    _appState.value = _appState.value.copy(
                        appointments = _appState.value.appointments.map { 
                            if (it.id == appointment.id) appointment else it 
                        }
                    )
                }
            }
            
            socket?.on("appointment_deleted") { args ->
                args.firstOrNull()?.let { data ->
                    val json = data as JSONObject
                    val id = json.getString("id")
                    _appState.value = _appState.value.copy(
                        appointments = _appState.value.appointments.filter { it.id != id }
                    )
                }
            }
            
            // Todo events
            socket?.on("todo_created") { args ->
                parseAndUpdateState<Todo>(args) { todo ->
                    _appState.value = _appState.value.copy(
                        todos = listOf(todo) + _appState.value.todos
                    )
                }
            }
            
            socket?.on("todo_updated") { args ->
                parseAndUpdateState<Todo>(args) { todo ->
                    _appState.value = _appState.value.copy(
                        todos = _appState.value.todos.map { if (it.id == todo.id) todo else it }
                    )
                }
            }
            
            socket?.on("todo_deleted") { args ->
                args.firstOrNull()?.let { data ->
                    val json = data as JSONObject
                    val id = json.getString("id")
                    _appState.value = _appState.value.copy(
                        todos = _appState.value.todos.filter { it.id != id }
                    )
                }
            }
            
            // Shopping events
            socket?.on("shopping_created") { args ->
                parseAndUpdateState<ShoppingItem>(args) { item ->
                    _appState.value = _appState.value.copy(
                        shopping = listOf(item) + _appState.value.shopping
                    )
                }
            }
            
            socket?.on("shopping_updated") { args ->
                parseAndUpdateState<ShoppingItem>(args) { item ->
                    _appState.value = _appState.value.copy(
                        shopping = _appState.value.shopping.map { if (it.id == item.id) item else it }
                    )
                }
            }
            
            socket?.on("shopping_deleted") { args ->
                args.firstOrNull()?.let { data ->
                    val json = data as JSONObject
                    val id = json.getString("id")
                    _appState.value = _appState.value.copy(
                        shopping = _appState.value.shopping.filter { it.id != id }
                    )
                }
            }
            
            socket?.on("shopping_cleared") { _ ->
                _appState.value = _appState.value.copy(
                    shopping = _appState.value.shopping.filter { !it.isChecked }
                )
            }
            
            // Activity events
            socket?.on("activity_created") { args ->
                parseAndUpdateState<ActivityLog>(args) { activity ->
                    _appState.value = _appState.value.copy(
                        activity = listOf(activity) + _appState.value.activity.take(49)
                    )
                }
            }
            
            socket?.connect()
            
        } catch (e: Exception) {
            Log.e("SocketManager", "Error connecting", e)
        }
    }
    
    private inline fun <reified T> parseAndUpdateState(args: Array<Any>, update: (T) -> Unit) {
        args.firstOrNull()?.let { data ->
            try {
                val json = data as JSONObject
                val item = gson.fromJson(json.toString(), T::class.java)
                update(item)
            } catch (e: Exception) {
                Log.e("SocketManager", "Error parsing ${T::class.simpleName}", e)
            }
        }
    }
    
    fun disconnect() {
        socket?.disconnect()
        socket?.off()
        socket = null
        _connectionState.value = false
    }
}
