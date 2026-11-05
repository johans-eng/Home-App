package com.homeapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.homeapp.data.*
import com.homeapp.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    appState: AppState,
    isConnected: Boolean,
    serverUrl: String,
    onToggleTodo: (String) -> Unit,
    onToggleShopping: (String) -> Unit,
    onChangeServer: () -> Unit
) {
    val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
    val dateDisplay = SimpleDateFormat("EEEE, MMMM d", Locale.getDefault()).format(Date())
    
    val todayAppointments = appState.appointments
        .filter { it.date == today }
        .sortedBy { it.time }
    
    val pendingTodos = appState.todos.filter { !it.isCompleted }
    val pendingShopping = appState.shopping.filter { !it.isChecked }
    val checkedShopping = appState.shopping.filter { it.isChecked }
    
    val homeUsers = appState.users.filter { it.isAtHome }
    val awayUsers = appState.users.filter { !it.isAtHome }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.linearGradient(
                    colors = listOf(Background, Surface.copy(alpha = 0.3f), Background)
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = null,
                            tint = OnBackground,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Column {
                        Text(
                            text = "Home Dashboard",
                            style = MaterialTheme.typography.headlineSmall,
                            color = OnBackground
                        )
                        Text(
                            text = dateDisplay,
                            style = MaterialTheme.typography.bodyMedium,
                            color = OnSurfaceVariant
                        )
                    }
                }
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Connection status
                    Box(
                        modifier = Modifier
                            .size(12.dp)
                            .clip(CircleShape)
                            .background(if (isConnected) Green500 else Red400)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isConnected) "Connected" else "Disconnected",
                        style = MaterialTheme.typography.bodySmall,
                        color = OnSurfaceVariant
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                    IconButton(onClick = onChangeServer) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = "Settings",
                            tint = OnSurfaceVariant
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Main content grid
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f),
                horizontalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                // Left column - Who's Home
                DashboardCard(
                    modifier = Modifier
                        .width(280.dp)
                        .fillMaxHeight(),
                    title = "Who's Home",
                    icon = Icons.Default.People,
                    iconColor = Primary
                ) {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Home users
                        item {
                            SectionHeader(
                                text = "At Home (${homeUsers.size})",
                                color = Green400
                            )
                        }
                        if (homeUsers.isEmpty()) {
                            item {
                                Text(
                                    text = "No one is home",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = OnSurfaceVariant,
                                    modifier = Modifier.padding(start = 8.dp)
                                )
                            }
                        }
                        items(homeUsers) { user ->
                            UserCard(user = user, isHome = true)
                        }
                        
                        // Away users
                        item {
                            Spacer(modifier = Modifier.height(16.dp))
                            SectionHeader(
                                text = "Away (${awayUsers.size})",
                                color = Amber400
                            )
                        }
                        if (awayUsers.isEmpty()) {
                            item {
                                Text(
                                    text = "Everyone is home!",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = OnSurfaceVariant,
                                    modifier = Modifier.padding(start = 8.dp)
                                )
                            }
                        }
                        items(awayUsers) { user ->
                            UserCard(user = user, isHome = false)
                        }
                    }
                }
                
                // Center column - Schedule & Lists
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(),
                    verticalArrangement = Arrangement.spacedBy(24.dp)
                ) {
                    // Today's Schedule
                    DashboardCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        title = "Today's Schedule",
                        icon = Icons.Default.CalendarToday,
                        iconColor = Blue400,
                        badge = "${todayAppointments.size}"
                    ) {
                        if (todayAppointments.isEmpty()) {
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(
                                        imageVector = Icons.Outlined.EventAvailable,
                                        contentDescription = null,
                                        tint = SurfaceVariant,
                                        modifier = Modifier.size(48.dp)
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = "No appointments today",
                                        color = OnSurfaceVariant
                                    )
                                }
                            }
                        } else {
                            LazyColumn(
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                items(todayAppointments) { apt ->
                                    AppointmentCard(appointment = apt)
                                }
                            }
                        }
                    }
                    
                    // Bottom row - Todos & Shopping
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        horizontalArrangement = Arrangement.spacedBy(24.dp)
                    ) {
                        // To-Do List
                        DashboardCard(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight(),
                            title = "To-Do List",
                            icon = Icons.Default.CheckBox,
                            iconColor = Amber400,
                            badge = "${pendingTodos.size}"
                        ) {
                            if (pendingTodos.isEmpty()) {
                                Box(
                                    modifier = Modifier.fillMaxSize(),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "All tasks completed! 🎉",
                                        color = OnSurfaceVariant
                                    )
                                }
                            } else {
                                LazyColumn(
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    items(pendingTodos) { todo ->
                                        TodoCard(
                                            todo = todo,
                                            onToggle = { onToggleTodo(todo.id) }
                                        )
                                    }
                                }
                            }
                        }
                        
                        // Shopping List
                        DashboardCard(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight(),
                            title = "Shopping",
                            icon = Icons.Default.ShoppingCart,
                            iconColor = Green400,
                            badge = "${pendingShopping.size}"
                        ) {
                            if (pendingShopping.isEmpty() && checkedShopping.isEmpty()) {
                                Box(
                                    modifier = Modifier.fillMaxSize(),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "List is empty",
                                        color = OnSurfaceVariant
                                    )
                                }
                            } else {
                                LazyColumn(
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    items(pendingShopping) { item ->
                                        ShoppingCard(
                                            item = item,
                                            onToggle = { onToggleShopping(item.id) }
                                        )
                                    }
                                    items(checkedShopping) { item ->
                                        ShoppingCard(
                                            item = item,
                                            onToggle = { onToggleShopping(item.id) }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Right column - Activity Feed
                DashboardCard(
                    modifier = Modifier
                        .width(300.dp)
                        .fillMaxHeight(),
                    title = "Activity",
                    icon = Icons.Default.Timeline,
                    iconColor = Purple400
                ) {
                    if (appState.activity.isEmpty()) {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "No activity yet",
                                color = OnSurfaceVariant
                            )
                        }
                    } else {
                        LazyColumn(
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(appState.activity) { activity ->
                                ActivityCard(activity = activity)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DashboardCard(
    modifier: Modifier = Modifier,
    title: String,
    icon: ImageVector,
    iconColor: androidx.compose.ui.graphics.Color,
    badge: String? = null,
    content: @Composable () -> Unit
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = Surface.copy(alpha = 0.5f)
        ),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(iconColor.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = iconColor,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    color = OnBackground
                )
                if (badge != null) {
                    Spacer(modifier = Modifier.weight(1f))
                    Badge(
                        containerColor = iconColor.copy(alpha = 0.2f),
                        contentColor = iconColor
                    ) {
                        Text(badge)
                    }
                }
            }
            Box(modifier = Modifier.weight(1f)) {
                content()
            }
        }
    }
}

@Composable
fun SectionHeader(text: String, color: androidx.compose.ui.graphics.Color) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(vertical = 4.dp)
    ) {
        Box(
            modifier = Modifier
                .size(8.dp)
                .clip(CircleShape)
                .background(color)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.labelMedium,
            color = color
        )
    }
}

@Composable
fun UserCard(user: User, isHome: Boolean) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(if (isHome) Green500.copy(alpha = 0.1f) else SurfaceVariant.copy(alpha = 0.3f))
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(if (isHome) Green500 else SurfaceVariant),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = user.name.first().uppercase(),
                style = MaterialTheme.typography.titleMedium,
                color = if (isHome) OnBackground else OnSurfaceVariant
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = user.name,
                style = MaterialTheme.typography.bodyLarge,
                color = if (isHome) OnBackground else OnSurfaceVariant
            )
            user.lastStatusChange?.let {
                Text(
                    text = "Since ${formatTime(it)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = if (isHome) Green400 else OnSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun AppointmentCard(appointment: Appointment) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceVariant.copy(alpha = 0.3f))
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .width(4.dp)
                .height(40.dp)
                .clip(RoundedCornerShape(2.dp))
                .background(Blue400)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = appointment.time,
            style = MaterialTheme.typography.labelLarge,
            color = Blue400,
            modifier = Modifier.width(50.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = appointment.title,
                style = MaterialTheme.typography.bodyLarge,
                color = OnBackground,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = "by ${appointment.userName ?: "Unknown"}",
                style = MaterialTheme.typography.bodySmall,
                color = OnSurfaceVariant
            )
        }
    }
}

@Composable
fun TodoCard(todo: Todo, onToggle: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(SurfaceVariant.copy(alpha = 0.2f))
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Checkbox(
            checked = todo.isCompleted,
            onCheckedChange = { onToggle() },
            colors = CheckboxDefaults.colors(
                checkedColor = Green500,
                uncheckedColor = OnSurfaceVariant
            )
        )
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = todo.title,
                style = MaterialTheme.typography.bodyMedium,
                color = if (todo.isCompleted) OnSurfaceVariant else OnBackground,
                textDecoration = if (todo.isCompleted) TextDecoration.LineThrough else null,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
        Text(
            text = todo.userName ?: "",
            style = MaterialTheme.typography.labelSmall,
            color = OnSurfaceVariant
        )
    }
}

@Composable
fun ShoppingCard(item: ShoppingItem, onToggle: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(SurfaceVariant.copy(alpha = if (item.isChecked) 0.1f else 0.2f))
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Checkbox(
            checked = item.isChecked,
            onCheckedChange = { onToggle() },
            colors = CheckboxDefaults.colors(
                checkedColor = Green500,
                uncheckedColor = OnSurfaceVariant
            )
        )
        Text(
            text = item.name,
            style = MaterialTheme.typography.bodyMedium,
            color = if (item.isChecked) OnSurfaceVariant else OnBackground,
            textDecoration = if (item.isChecked) TextDecoration.LineThrough else null,
            modifier = Modifier.weight(1f),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
        if (item.quantity > 1) {
            Text(
                text = "x${item.quantity}",
                style = MaterialTheme.typography.labelSmall,
                color = OnSurfaceVariant
            )
            Spacer(modifier = Modifier.width(8.dp))
        }
        Text(
            text = item.userName ?: "",
            style = MaterialTheme.typography.labelSmall,
            color = OnSurfaceVariant
        )
    }
}

@Composable
fun ActivityCard(activity: ActivityLog) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        val (icon, color) = getActivityIconAndColor(activity.action)
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(color.copy(alpha = 0.2f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(16.dp)
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = activity.details ?: activity.action,
                style = MaterialTheme.typography.bodySmall,
                color = OnBackground
            )
            Text(
                text = formatRelativeTime(activity.createdAt),
                style = MaterialTheme.typography.labelSmall,
                color = OnSurfaceVariant
            )
        }
    }
}

fun getActivityIconAndColor(action: String): Pair<ImageVector, androidx.compose.ui.graphics.Color> {
    return when {
        action.contains("arrived") || action.contains("home") -> Icons.Default.Home to Green400
        action.contains("left") || action.contains("away") -> Icons.Default.DirectionsWalk to Amber400
        action.contains("appointment") -> Icons.Default.CalendarToday to Blue400
        action.contains("todo") -> Icons.Default.CheckBox to Purple400
        action.contains("shopping") -> Icons.Default.ShoppingCart to Cyan400
        action.contains("joined") -> Icons.Default.PersonAdd to Primary
        else -> Icons.Default.Info to OnSurfaceVariant
    }
}

fun formatTime(isoString: String?): String {
    if (isoString == null) return ""
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val outputFormat = SimpleDateFormat("HH:mm", Locale.getDefault())
        val date = inputFormat.parse(isoString)
        date?.let { outputFormat.format(it) } ?: ""
    } catch (e: Exception) {
        ""
    }
}

fun formatRelativeTime(isoString: String?): String {
    if (isoString == null) return ""
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val date = inputFormat.parse(isoString) ?: return ""
        val now = Date()
        val diffMs = now.time - date.time
        val diffMins = diffMs / 60000
        val diffHours = diffMs / 3600000
        
        when {
            diffMins < 1 -> "Just now"
            diffMins < 60 -> "${diffMins}m ago"
            diffHours < 24 -> "${diffHours}h ago"
            else -> SimpleDateFormat("MMM d", Locale.getDefault()).format(date)
        }
    } catch (e: Exception) {
        ""
    }
}
