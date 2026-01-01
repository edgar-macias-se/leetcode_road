function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    // 1. Inicializar estructuras
    const indegree: number[] = new Array(numCourses).fill(0);
    const adj: number[][] = Array.from({ length: numCourses }, () => []);

    // 2. Construir grafo
    // prerequisites[i] = [course, prerequisite]
    // "Para tomar 'course', necesitas 'prerequisite' primero"
    // Arista: prerequisite → course
    for (const [course, prerequisite] of prerequisites) {
        indegree[course]++;              // course depende de prerequisite
        adj[prerequisite].push(course);   // prerequisite → course
    }

    // 3. Cola con cursos sin prerequisitos
    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }

    // 4. Procesar cursos en orden topológico
    let processed = 0;

    while (queue.length > 0) {
        const course = queue.shift()!;
        processed++;

        // Remover este curso como prerequisito de otros
        for (const neighbor of adj[course]) {
            indegree[neighbor]--;

            // Si ya no tiene prerequisitos, puede tomarse
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }

    // 5. Verificar si todos los cursos fueron procesados
    return processed === numCourses;
}