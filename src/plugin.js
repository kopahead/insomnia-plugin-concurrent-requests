module.exports.requestGroupActions = [
  {
    label: "Concurrent Request",
    action: async (context, data) => {
      const { requests } = data;

      const allRequests = [];

      requests.forEach(request => {
        allRequests.push(
          context.network.sendRequest(request)
        )
      });

      const getRequestValue = (requestId, value) => {
        const req = requests.filter((request) => {
          return request._id === requestId
        })

        return req.length > 0 ? req[0][value] : requestId;
      }

      Promise.allSettled(allRequests).then((response) => {
        const results = [];
        
        for (const responseItem of response) {
          const style =
          responseItem.value.statusCode > 300
              ? "padding:5px; color: var(--color-font-danger); background: var(--color-danger)"
              : "padding:5px; color: var(--color-font-success); background: var(--color-success)";

              results.push(
                `<li style="margin: 5px">${getRequestValue(responseItem.value.parentId, 'name')}: <span style="${style}")>${responseItem.value.statusCode}</span></li>`
              );
        }

        const html = `<ul style="column-count: ${
          results.length > 10 ? 2 : 1
        };">${results.join("\n")}</ul>`;

        context.app.showGenericModalDialog("Results", { html });
      });
    },
  },
];
