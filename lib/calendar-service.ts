// Google Calendar Integration
// This uses the Google Calendar API v3

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{ email: string }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: string; minutes: number }>;
  };
}

export class CalendarService {
  private static accessToken: string | null = null;

  // Configurar el token de acceso
  static setAccessToken(token: string) {
    this.accessToken = token;
  }

  // Crear un evento en Google Calendar
  static async createEvent(
    calendarId: string = 'primary',
    event: CalendarEvent
  ): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token configured');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Calendar event creation error:', error);
      throw new Error('Error al crear el evento en Google Calendar');
    }
  }

  // Listar eventos
  static async listEvents(
    calendarId: string = 'primary',
    options: {
      timeMin?: string;
      timeMax?: string;
      maxResults?: number;
      orderBy?: string;
    } = {}
  ): Promise<any[]> {
    if (!this.accessToken) {
      throw new Error('No access token configured');
    }

    try {
      const params = new URLSearchParams({
        timeMin: options.timeMin || new Date().toISOString(),
        timeMax: options.timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxResults: String(options.maxResults || 10),
        orderBy: options.orderBy || 'startTime',
        singleEvents: 'true',
      });

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Calendar events list error:', error);
      throw new Error('Error al listar eventos de Google Calendar');
    }
  }

  // Actualizar un evento
  static async updateEvent(
    calendarId: string = 'primary',
    eventId: string,
    event: Partial<CalendarEvent>
  ): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token configured');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Calendar event update error:', error);
      throw new Error('Error al actualizar el evento en Google Calendar');
    }
  }

  // Eliminar un evento
  static async deleteEvent(
    calendarId: string = 'primary',
    eventId: string
  ): Promise<void> {
    if (!this.accessToken) {
      throw new Error('No access token configured');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok && response.status !== 204) {
        throw new Error(`Google Calendar API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Calendar event deletion error:', error);
      throw new Error('Error al eliminar el evento de Google Calendar');
    }
  }

  // Sincronizar tareas de Hermes con Google Calendar
  static async syncTasksToCalendar(
    tasks: Array<{
      id: string;
      title: string;
      description?: string;
      dueDate: string;
      duration?: number; // en minutos
    }>
  ): Promise<{ synced: number; errors: string[] }> {
    let synced = 0;
    const errors: string[] = [];

    for (const task of tasks) {
      try {
        const startTime = new Date(task.dueDate);
        const endTime = new Date(startTime.getTime() + (task.duration || 60) * 60000);

        await this.createEvent('primary', {
          summary: `[Hermes] ${task.title}`,
          description: task.description || '',
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'Europe/Madrid',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'Europe/Madrid',
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 30 },
            ],
          },
        });

        synced++;
      } catch (error) {
        errors.push(`Error al sincronizar tarea "${task.title}": ${error}`);
      }
    }

    return { synced, errors };
  }

  // Encontrar horarios disponibles (free/busy)
  static async findAvailableSlots(
    calendarIds: string[] = ['primary'],
    timeMin: string,
    timeMax: string
  ): Promise<any> {
    if (!this.accessToken) {
      throw new Error('No access token configured');
    }

    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/freeBusy',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timeMin,
            timeMax,
            items: calendarIds.map(id => ({ id })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Free/busy query error:', error);
      throw new Error('Error al consultar disponibilidad');
    }
  }
}
