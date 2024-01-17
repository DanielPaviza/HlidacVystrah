using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hlidacVystrah.Migrations
{
    /// <inheritdoc />
    public partial class debug : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "dpc",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_event_type = table.Column<int>(type: "int", nullable: false),
                    id_severity = table.Column<int>(type: "int", nullable: false),
                    id_certainity = table.Column<int>(type: "int", nullable: false),
                    id_area = table.Column<int>(type: "int", nullable: false),
                    isRegion = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dpc", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dpc");
        }
    }
}
