let droneData = {};

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Обработка CORS preflight запроса
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            const { drone_id, lat, lon } = body;

            if (!drone_id || !lat || !lon) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ status: 'error', message: 'Неверный формат данных' })
                };
            }

            droneData[drone_id] = { lat, lon, timestamp: new Date().toISOString() };
            console.log(`Получены данные: ${JSON.stringify(droneData[drone_id])}`);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ status: 'success', message: 'Данные получены' })
            };
        }

        if (event.httpMethod === 'GET') {
            const droneId = event.queryStringParameters?.drone_id;
            if (!droneId || !droneData[droneId]) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ status: 'error', message: 'Данные для дрона не найдены' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(droneData[droneId])
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ status: 'error', message: 'Метод не поддерживается' })
        };
    } catch (error) {
        console.error('Ошибка:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ status: 'error', message: 'Внутренняя ошибка сервера' })
        };
    }
};