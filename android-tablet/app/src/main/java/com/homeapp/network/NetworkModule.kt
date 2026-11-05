package com.homeapp.network

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object NetworkModule {
    private var baseUrl = "http://192.168.1.100:3000/" // Default, will be configured
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private var retrofit: Retrofit? = null
    private var apiService: ApiService? = null
    
    fun setBaseUrl(url: String) {
        baseUrl = if (url.endsWith("/")) url else "$url/"
        retrofit = null
        apiService = null
    }
    
    fun getBaseUrl(): String = baseUrl
    
    private fun getRetrofit(): Retrofit {
        return retrofit ?: Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build().also { retrofit = it }
    }
    
    fun getApiService(): ApiService {
        return apiService ?: getRetrofit().create(ApiService::class.java).also { apiService = it }
    }
}
