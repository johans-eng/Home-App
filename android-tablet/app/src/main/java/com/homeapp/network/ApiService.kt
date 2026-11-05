package com.homeapp.network

import com.homeapp.data.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    // Users
    @GET("api/users")
    suspend fun getUsers(): Response<List<User>>

    @POST("api/users")
    suspend fun createUser(@Body body: Map<String, String>): Response<User>

    @PUT("api/users/{id}/status")
    suspend fun updateStatus(@Path("id") id: String, @Body body: Map<String, Boolean>): Response<User>

    // Appointments
    @GET("api/appointments")
    suspend fun getAppointments(): Response<List<Appointment>>

    @GET("api/appointments/today")
    suspend fun getTodayAppointments(): Response<List<Appointment>>

    // Todos
    @GET("api/todos")
    suspend fun getTodos(): Response<List<Todo>>

    @PUT("api/todos/{id}/toggle")
    suspend fun toggleTodo(@Path("id") id: String): Response<Todo>

    // Shopping
    @GET("api/shopping")
    suspend fun getShopping(): Response<List<ShoppingItem>>

    @PUT("api/shopping/{id}/toggle")
    suspend fun toggleShoppingItem(@Path("id") id: String): Response<ShoppingItem>

    // Activity
    @GET("api/activity")
    suspend fun getActivity(@Query("limit") limit: Int = 50): Response<List<ActivityLog>>

    // Health check
    @GET("api/health")
    suspend fun healthCheck(): Response<Map<String, String>>
}
