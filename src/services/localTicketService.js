import AsyncStorage from '@react-native-async-storage/async-storage';

const TICKETS_KEY = '@movie_tickets';

// Lay tat ca ve tu local storage
export const getLocalTickets = async () => {
  try {
    const ticketsJson = await AsyncStorage.getItem(TICKETS_KEY);
    if (ticketsJson) {
      return { success: true, data: JSON.parse(ticketsJson) };
    }
    return { success: true, data: [] };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// Luu ve moi vao local storage
export const saveLocalTicket = async (ticketData) => {
  try {
    const result = await getLocalTickets();
    const tickets = result.data || [];

    const newTicket = {
      ...ticketData,
      id: 'local_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    tickets.unshift(newTicket); // Them vao dau danh sach
    await AsyncStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));

    return { success: true, ticketId: newTicket.id, ticket: newTicket };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Huy ve trong local storage
export const cancelLocalTicket = async (ticketId) => {
  try {
    const result = await getLocalTickets();
    const tickets = result.data || [];

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, status: 'cancelled', cancelledAt: new Date().toISOString() };
      }
      return ticket;
    });

    await AsyncStorage.setItem(TICKETS_KEY, JSON.stringify(updatedTickets));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Xoa ve trong local storage
export const deleteLocalTicket = async (ticketId) => {
  try {
    const result = await getLocalTickets();
    const tickets = result.data || [];

    const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
    await AsyncStorage.setItem(TICKETS_KEY, JSON.stringify(updatedTickets));

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Xoa tat ca ve (reset)
export const clearAllLocalTickets = async () => {
  try {
    await AsyncStorage.removeItem(TICKETS_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
