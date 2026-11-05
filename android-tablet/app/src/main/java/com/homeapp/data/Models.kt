package com.homeapp.data

import com.google.gson.annotations.SerializedName

data class User(
    val id: String,
    val name: String,
    val avatar: String? = null,
    @SerializedName("is_home") val isHome: Int = 0,
    @SerializedName("last_status_change") val lastStatusChange: String? = null,
    @SerializedName("created_at") val createdAt: String? = null
) {
    val isAtHome: Boolean get() = isHome == 1
}

data class Appointment(
    val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("user_name") val userName: String? = null,
    val title: String,
    val date: String,
    val time: String,
    val notes: String? = null,
    @SerializedName("created_at") val createdAt: String? = null
)

data class Todo(
    val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("user_name") val userName: String? = null,
    val title: String,
    val completed: Int = 0,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("completed_at") val completedAt: String? = null
) {
    val isCompleted: Boolean get() = completed == 1
}

data class ShoppingItem(
    val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("user_name") val userName: String? = null,
    val name: String,
    val quantity: Int = 1,
    val checked: Int = 0,
    @SerializedName("created_at") val createdAt: String? = null
) {
    val isChecked: Boolean get() = checked == 1
}

data class ActivityLog(
    val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("user_name") val userName: String? = null,
    val action: String,
    val details: String? = null,
    @SerializedName("created_at") val createdAt: String? = null
)

data class AppState(
    val users: List<User> = emptyList(),
    val appointments: List<Appointment> = emptyList(),
    val todos: List<Todo> = emptyList(),
    val shopping: List<ShoppingItem> = emptyList(),
    val activity: List<ActivityLog> = emptyList()
)

data class InitialState(
    val users: List<User>,
    val appointments: List<Appointment>,
    val todos: List<Todo>,
    val shopping: List<ShoppingItem>,
    val activity: List<ActivityLog>
)
