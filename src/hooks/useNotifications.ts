import { useEffect } from 'react';
import { useHabits } from './useHabits';

export function useNotifications() {
  const { habits } = useHabits();

  useEffect(() => {
    // Request permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const checkNotifications = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday

      habits.forEach((habit) => {
        // Only notify if there's a reminder time that matches right now
        // And if the habit is scheduled for today
        if (habit.reminderTime === currentTime && habit.targetDays.includes(currentDay)) {
          // Check if already completed today
          const isCompletedToday = habit.completedDates.some(date => {
            const d = new Date(date);
            return (
              d.getFullYear() === now.getFullYear() &&
              d.getMonth() === now.getMonth() &&
              d.getDate() === now.getDate()
            );
          });

          if (!isCompletedToday) {
            // Check if we've already notified today to prevent spam (using localStorage)
            const notificationKey = `notified_${habit.id}_${now.toDateString()}`;
            if (!localStorage.getItem(notificationKey)) {
              // Send notification
              try {
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                  // If Service Worker is active, use it to show the notification (works better on some mobile OS)
                  navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification('Bright Habits Reminder', {
                      body: `Time for your habit: ${habit.name}!`,
                      icon: '/icon-192.png',
                      badge: '/icon-192.png',
                      tag: `habit-${habit.id}`
                    });
                  });
                } else {
                  // Fallback to standard Notification
                  new Notification('Bright Habits Reminder', {
                    body: `Time for your habit: ${habit.name}!`,
                    icon: '/icon-192.png',
                  });
                }
                localStorage.setItem(notificationKey, 'true');
              } catch (err) {
                console.error("Error showing notification:", err);
              }
            }
          }
        }
      });
    };

    // Check immediately, then every minute
    checkNotifications();
    
    // Calculate ms until next minute to align the interval
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    
    let intervalId: NodeJS.Timeout;
    
    const timeoutId = setTimeout(() => {
      checkNotifications();
      intervalId = setInterval(checkNotifications, 60000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [habits]);
}
