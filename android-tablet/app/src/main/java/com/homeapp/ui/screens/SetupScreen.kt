package com.homeapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.homeapp.ui.theme.*

@Composable
fun SetupScreen(
    onServerUrlSubmit: (String) -> Unit
) {
    var serverUrl by remember { mutableStateOf("http://") }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.linearGradient(
                    colors = listOf(Background, Surface, Background)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .widthIn(max = 400.dp)
                .padding(24.dp)
        ) {
            // Logo
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(Primary),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Home,
                    contentDescription = null,
                    tint = OnBackground,
                    modifier = Modifier.size(40.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "Home App",
                style = MaterialTheme.typography.headlineLarge,
                color = OnBackground
            )
            
            Text(
                text = "Family Dashboard",
                style = MaterialTheme.typography.bodyLarge,
                color = OnSurfaceVariant
            )
            
            Spacer(modifier = Modifier.height(48.dp))
            
            // Setup card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = Surface.copy(alpha = 0.5f)
                ),
                shape = RoundedCornerShape(24.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp)
                ) {
                    Text(
                        text = "Connect to Server",
                        style = MaterialTheme.typography.titleLarge,
                        color = OnBackground
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Text(
                        text = "Enter the IP address of your Home App server",
                        style = MaterialTheme.typography.bodyMedium,
                        color = OnSurfaceVariant
                    )
                    
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    OutlinedTextField(
                        value = serverUrl,
                        onValueChange = { serverUrl = it },
                        label = { Text("Server URL") },
                        placeholder = { Text("http://192.168.1.100:3000") },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Wifi,
                                contentDescription = null,
                                tint = Primary
                            )
                        },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Uri,
                            imeAction = ImeAction.Done
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = {
                                if (serverUrl.isNotBlank() && serverUrl != "http://") {
                                    onServerUrlSubmit(serverUrl)
                                }
                            }
                        ),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Primary,
                            unfocusedBorderColor = SurfaceVariant,
                            focusedTextColor = OnBackground,
                            unfocusedTextColor = OnBackground
                        ),
                        shape = RoundedCornerShape(16.dp)
                    )
                    
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    Button(
                        onClick = {
                            if (serverUrl.isNotBlank() && serverUrl != "http://") {
                                onServerUrlSubmit(serverUrl)
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Primary
                        )
                    ) {
                        Text(
                            text = "Connect",
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "Make sure your server is running and\nboth devices are on the same network",
                style = MaterialTheme.typography.bodySmall,
                color = OnSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }
    }
}
